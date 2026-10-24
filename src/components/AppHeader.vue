<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

// Logo 目标随身份变化：已登录回工作台，未登录回首页。
const brandTo = computed(() => (auth.isAuthenticated ? { name: 'dashboard' } : { name: 'home' }))

const avatarChar = computed(() => {
  const name = auth.user?.display_name
  return name ? [...name][0] ?? '译' : '译'
})
</script>

<template>
  <header class="topbar">
    <div class="wrap topbar-inner">
      <RouterLink class="brand" :to="brandTo" aria-label="译伴 首页">
        <span class="seal">译</span>
        <span class="name">译伴</span>
      </RouterLink>

      <span class="spacer"></span>

      <template v-if="auth.isAuthenticated">
        <RouterLink class="user-chip" :to="{ name: 'dashboard' }" aria-label="进入工作台">
          <span class="av">{{ avatarChar }}</span>
          <span class="u-name">{{ auth.user?.display_name }}</span>
        </RouterLink>
      </template>
      <template v-else-if="auth.status === 'unauthenticated'">
        <RouterLink class="btn btn-ghost btn-sm" :to="{ name: 'login' }">登录</RouterLink>
        <RouterLink class="btn btn-primary btn-sm" :to="{ name: 'register' }">注册</RouterLink>
      </template>
      <template v-else-if="auth.status === 'restore-error'">
        <button class="btn btn-ghost btn-sm" type="button" @click="auth.restore()">重新加载</button>
      </template>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 253, 248, 0.86);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line);
}

.topbar-inner {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 64px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 11px;
  flex-shrink: 0;
}

.brand .seal {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: linear-gradient(150deg, var(--ink) 0%, var(--ink-3) 100%);
  display: grid;
  place-items: center;
  color: var(--gold-2);
  font-family: var(--serif);
  font-weight: 700;
  font-size: 18px;
  box-shadow: var(--shadow-sm);
  position: relative;
}

.brand .seal::after {
  content: '';
  position: absolute;
  inset: 3px;
  border: 1px solid rgba(199, 154, 69, 0.5);
  border-radius: 6px;
}

.brand .name {
  font-family: var(--serif);
  font-weight: 700;
  font-size: 17px;
  color: var(--ink);
  letter-spacing: 0.5px;
}

.spacer {
  flex: 1;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 5px 14px 5px 5px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 999px;
  box-shadow: var(--shadow-sm);
}

.user-chip .av {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--jade-soft);
  color: var(--jade);
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.user-chip .u-name {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink);
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 560px) {
  .topbar-inner {
    gap: 8px;
    padding: 0 12px;
  }

  .user-chip .u-name {
    max-width: 96px;
  }
}
</style>
