<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLogout } from '@/composables/useLogout'

const auth = useAuthStore()
const route = useRoute()
const { pending: loggingOut, error: logoutError, logout } = useLogout()

// Logo 目标随身份变化：已登录回工作台，未登录回首页。
const brandTo = computed(() => (auth.isAuthenticated ? { name: 'dashboard' } : { name: 'home' }))

const avatarChar = computed(() => {
  const name = auth.user?.display_name
  return name ? [...name][0] ?? '译' : '译'
})

// 账号下拉菜单
const menuOpen = ref(false)
const acctRef = ref<HTMLElement | null>(null)
const acctBtnRef = ref<HTMLButtonElement | null>(null)
function toggleMenu(): void {
  menuOpen.value = !menuOpen.value
}
/** 键盘展开：打开后把焦点移到首个可操作项。 */
function openMenu(): void {
  menuOpen.value = true
  void nextTick(() => {
    acctRef.value?.querySelector<HTMLElement>('.acct-item')?.focus()
  })
}
function closeMenu(focusBack = false): void {
  menuOpen.value = false
  if (focusBack) acctBtnRef.value?.focus()
}

// 移动端导航抽屉
const drawerOpen = ref(false)
function toggleDrawer(): void {
  drawerOpen.value = !drawerOpen.value
}
function closeDrawer(): void {
  drawerOpen.value = false
}

// 退出登录：失败时保持菜单打开以展示错误并可重试；成功后身份清除、组件切到游客态，菜单随之消失。
async function onLogout(): Promise<void> {
  await logout()
}

function onDocumentClick(e: MouseEvent): void {
  if (menuOpen.value && acctRef.value && !acctRef.value.contains(e.target as Node)) {
    closeMenu()
  }
}
function onKeydown(e: KeyboardEvent): void {
  if (e.key !== 'Escape') return
  if (menuOpen.value) {
    closeMenu(true)
  } else if (drawerOpen.value) {
    closeDrawer()
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})

// 路由变化时收起下拉与抽屉。
watch(
  () => route.fullPath,
  () => {
    closeMenu()
    closeDrawer()
  },
)
</script>

<template>
  <header class="topbar">
    <div class="wrap">
      <RouterLink class="brand" :to="brandTo" aria-label="译伴 首页">
        <span class="seal-mark">译伴</span>
      </RouterLink>

      <nav class="nav" aria-label="主导航">
        <RouterLink :to="{ name: 'dashboard' }">工作台</RouterLink>
      </nav>

      <span class="spacer"></span>

      <template v-if="auth.isAuthenticated">
        <div class="acct" ref="acctRef">
          <button
            class="acct-btn"
            ref="acctBtnRef"
            type="button"
            aria-haspopup="true"
            :aria-expanded="menuOpen"
            @click="toggleMenu"
            @keydown.down.prevent="openMenu"
          >
            <span class="av" aria-hidden="true">{{ avatarChar }}</span>
            <span class="acct-meta">
              <span class="u-name">{{ auth.user?.display_name }}</span>
              <span class="u-mail">{{ auth.user?.email }}</span>
            </span>
            <span class="caret" aria-hidden="true"></span>
          </button>
          <div v-if="menuOpen" class="acct-menu" role="menu">
            <p class="acct-mail">{{ auth.user?.email }}</p>
            <p v-if="logoutError" class="logout-error" role="alert">{{ logoutError }}</p>
            <button class="acct-item" type="button" role="menuitem" :disabled="loggingOut" @click="onLogout">
              {{ loggingOut ? '退出中…' : '退出登录' }}
            </button>
          </div>
        </div>
      </template>
      <template v-else-if="auth.status === 'unauthenticated'">
        <div class="guest-actions">
          <RouterLink class="btn btn-ghost btn-sm" :to="{ name: 'login' }">登录</RouterLink>
          <RouterLink class="btn btn-primary btn-sm" :to="{ name: 'register' }">注册</RouterLink>
        </div>
      </template>
      <template v-else-if="auth.status === 'restore-error'">
        <button class="btn btn-ghost btn-sm" type="button" @click="auth.restore()">重新加载</button>
      </template>

      <button
        class="menu-btn"
        type="button"
        aria-label="菜单"
        :aria-expanded="drawerOpen"
        @click="toggleDrawer"
      >
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <div id="mobile-nav" :class="{ open: drawerOpen }" @click="closeDrawer">
    <RouterLink :to="{ name: 'home' }">首页</RouterLink>
    <RouterLink :to="{ name: 'dashboard' }">工作台</RouterLink>
    <template v-if="auth.status === 'unauthenticated'">
      <div class="mn-foot">
        <RouterLink :to="{ name: 'login' }">登录</RouterLink>
        <RouterLink :to="{ name: 'register' }">注册</RouterLink>
      </div>
    </template>
  </div>
  <div id="nav-mask" :class="{ show: drawerOpen }" @click="closeDrawer"></div>
</template>

<style scoped>
.logout-error {
  margin: 0 0 8px;
  padding: 8px 10px;
  font-size: 12.5px;
  color: var(--err);
  background: var(--err-bg);
  border-radius: 8px;
}
</style>
