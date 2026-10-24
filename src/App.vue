<script setup lang="ts">
import { watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import { useAuthStore } from '@/stores/auth'
import { GUEST_ONLY } from '@/router/guard'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

// 登录态与路由同步：身份在页面停留期间变化时（如重试恢复），保持与守卫一致的引导，
// 避免工作台停留在“未登录”或公开页停留在“已登录”的错位状态。
watch(
  () => auth.status,
  (status) => {
    if (status === 'authenticated' && GUEST_ONLY.has(String(route.name))) {
      void router.replace({ name: 'dashboard' })
    }
    if (status === 'unauthenticated' && route.meta.requiresAuth) {
      void router.replace({ name: 'login', query: { redirect: route.fullPath } })
    }
  },
)
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <component :is="Component" />
      </template>
      <div v-else class="app-loading" aria-live="polite">正在载入…</div>
    </RouterView>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-loading {
  display: grid;
  place-items: center;
  flex: 1;
  min-height: 50vh;
  color: var(--muted);
  font-size: 14px;
}
</style>
