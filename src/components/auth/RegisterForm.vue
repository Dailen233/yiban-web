<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { register } from '@/api/auth'
import {
  normalizeEmail,
  validateDisplayName,
  validateEmail,
  validatePassword,
} from '@/utils/validation'
import { toApiError } from '@/utils/request'

const displayName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const displayNameError = ref<string | null>(null)
const emailError = ref<string | null>(null)
const passwordError = ref<string | null>(null)
const confirmError = ref<string | null>(null)
const formError = ref<string | null>(null)
const submitting = ref(false)
const registeredEmail = ref<string | null>(null)

function validate(): boolean {
  displayNameError.value = validateDisplayName(displayName.value)
  emailError.value = validateEmail(email.value)
  passwordError.value = validatePassword(password.value)
  confirmError.value =
    password.value && confirmPassword.value !== password.value ? '两次输入的密码不一致' : null
  return !displayNameError.value && !emailError.value && !passwordError.value && !confirmError.value
}

async function onSubmit(): Promise<void> {
  if (submitting.value) return
  formError.value = null
  if (!validate()) return

  submitting.value = true
  try {
    const user = await register({
      email: normalizeEmail(email.value),
      password: password.value,
      display_name: displayName.value.trim(),
    })
    // 注册成功仅代表账号已创建，不写入会话，需引导登录。
    registeredEmail.value = user.email
  } catch (err) {
    formError.value = toApiError(err).message
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div v-if="registeredEmail">
    <div class="alert alert-ok" role="status">
      账号创建成功（{{ registeredEmail }}）。请登录后继续使用译伴。
    </div>
    <RouterLink class="btn btn-primary btn-block" :to="{ name: 'login' }">去登录</RouterLink>
  </div>

  <form v-else novalidate @submit.prevent="onSubmit">
    <div v-if="formError" class="alert alert-err" role="alert">{{ formError }}</div>

    <div class="field">
      <label for="register-name">昵称</label>
      <input
        id="register-name"
        v-model="displayName"
        class="input"
        :class="{ 'is-invalid': displayNameError }"
        type="text"
        name="display_name"
        autocomplete="name"
        :aria-invalid="Boolean(displayNameError)"
        @input="displayNameError = null"
      />
      <div v-if="displayNameError" class="field-error">{{ displayNameError }}</div>
    </div>

    <div class="field">
      <label for="register-email">邮箱</label>
      <input
        id="register-email"
        v-model="email"
        class="input"
        :class="{ 'is-invalid': emailError }"
        type="email"
        name="email"
        autocomplete="email"
        :aria-invalid="Boolean(emailError)"
        @input="emailError = null"
      />
      <div v-if="emailError" class="field-error">{{ emailError }}</div>
    </div>

    <div class="field">
      <label for="register-password">密码</label>
      <input
        id="register-password"
        v-model="password"
        class="input"
        :class="{ 'is-invalid': passwordError }"
        type="password"
        name="password"
        autocomplete="new-password"
        :aria-invalid="Boolean(passwordError)"
        @input="passwordError = null"
      />
      <div v-if="passwordError" class="field-error">{{ passwordError }}</div>
      <div class="hint">密码至少 8 个字符。</div>
    </div>

    <div class="field">
      <label for="register-confirm">确认密码</label>
      <input
        id="register-confirm"
        v-model="confirmPassword"
        class="input"
        :class="{ 'is-invalid': confirmError }"
        type="password"
        name="confirm_password"
        autocomplete="new-password"
        :aria-invalid="Boolean(confirmError)"
        @input="confirmError = null"
      />
      <div v-if="confirmError" class="field-error">{{ confirmError }}</div>
    </div>

    <button class="btn btn-jade btn-block" type="submit" :disabled="submitting">
      {{ submitting ? '注册中…' : '注册' }}
    </button>
  </form>
</template>

<style scoped>
.hint {
  font-size: 12.5px;
  color: var(--muted);
  margin-top: 6px;
}
</style>
