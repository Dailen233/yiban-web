<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useLogout } from '@/composables/useLogout'

const auth = useAuthStore()
const { pending: loggingOut, error: logoutError, logout } = useLogout()

const ROLE_LABELS: Record<string, string> = {
  user: '普通用户',
  admin: '管理员',
}

// 按后端返回的 user.role 展示；未知角色回退为原始值，缺失时显示“未知”。
const roleText = computed(() => {
  const role = auth.user?.role
  if (!role) return '未知'
  return ROLE_LABELS[role] ?? role
})
</script>

<template>
  <main class="page-main">
    <div class="wrap-narrow">
      <template v-if="auth.isAuthenticated">
        <h1 class="page-title">工作台</h1>
        <p class="welcome">你好，{{ auth.user?.display_name }}。这是你的译伴工作台。</p>

        <div class="card identity">
          <dl>
            <div class="row">
              <dt>昵称</dt>
              <dd>{{ auth.user?.display_name }}</dd>
            </div>
            <div class="row">
              <dt>邮箱</dt>
              <dd>{{ auth.user?.email }}</dd>
            </div>
            <div class="row">
              <dt>角色</dt>
              <dd><span class="badge b-ok">{{ roleText }}</span></dd>
            </div>
          </dl>
        </div>

        <div v-if="logoutError" class="alert alert-err" role="alert">{{ logoutError }}</div>

        <button class="btn btn-danger" type="button" :disabled="loggingOut" @click="logout">
          {{ loggingOut ? '退出中…' : '退出登录' }}
        </button>
      </template>

      <template v-else-if="auth.status === 'restore-error'">
        <h1 class="page-title">登录状态暂不可用</h1>
        <p class="welcome">暂时无法确认你的登录状态，可能是服务或网络异常，请稍后重试。</p>
        <div v-if="auth.restoreError" class="alert alert-err" role="alert">
          {{ auth.restoreError }}
        </div>
        <button class="btn btn-primary" type="button" @click="auth.restore()">重试</button>
      </template>

      <div v-else class="loading">正在载入…</div>
    </div>
  </main>
</template>

<style scoped>
.page-title {
  font-size: 1.9rem;
  margin-bottom: 6px;
}

.welcome {
  color: var(--muted);
  margin-bottom: 24px;
}

.identity {
  margin-bottom: 20px;
  padding: 24px;
}

.identity dl {
  margin: 0;
}

.identity .row {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
}

.identity .row:last-child {
  border-bottom: none;
}

.identity dt {
  width: 72px;
  flex-shrink: 0;
  font-size: 13px;
  color: var(--muted);
}

.identity dd {
  margin: 0;
  font-size: 15px;
  color: var(--ink);
  word-break: break-all;
}

.loading {
  color: var(--muted);
  padding: 40px 0;
  text-align: center;
}
</style>
