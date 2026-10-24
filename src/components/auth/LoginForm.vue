<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { validateEmail } from '@/utils/validation'
import { toApiError } from '@/utils/request'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')

const emailError = ref<string | null>(null)
const passwordError = ref<string | null>(null)
const formError = ref<string | null>(null)
const submitting = ref(false)

// 登录成功后回到来源受保护页（仅接受站内相对路径），否则进工作台。
const redirect = computed(() => {
  const q = route.query.redirect
  return typeof q === 'string' && q.startsWith('/') && !q.startsWith('//') ? q : '/dashboard'
})

function validate(): boolean {
  emailError.value = validateEmail(email.value)
  passwordError.value = password.value ? null : '请输入密码'
  return !emailError.value && !passwordError.value
}

async function onSubmit(): Promise<void> {
  if (submitting.value) return
  formError.value = null
  if (!validate()) return

  submitting.value = true
  try {
    await auth.login({ email: email.value, password: password.value })
    await router.push(redirect.value)
  } catch (err) {
    formError.value = toApiError(err).message
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <div v-if="formError" class="alert alert-err" role="alert">{{ formError }}</div>

    <div class="field">
      <label for="login-email">邮箱</label>
      <input
        id="login-email"
        v-model="email"
        class="input"
        :class="{ 'is-invalid': emailError }"
        type="email"
        name="email"
        autocomplete="username"
        :aria-invalid="Boolean(emailError)"
        @input="emailError = null"
      />
      <div v-if="emailError" class="field-error">{{ emailError }}</div>
    </div>

    <div class="field">
      <label for="login-password">密码</label>
      <input
        id="login-password"
        v-model="password"
        class="input"
        :class="{ 'is-invalid': passwordError }"
        type="password"
        name="password"
        autocomplete="current-password"
        :aria-invalid="Boolean(passwordError)"
        @input="passwordError = null"
      />
      <div v-if="passwordError" class="field-error">{{ passwordError }}</div>
    </div>

    <button class="btn btn-primary btn-block" type="submit" :disabled="submitting">
      {{ submitting ? '登录中…' : '登录' }}
    </button>
  </form>
</template>
