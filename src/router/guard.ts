import type { NavigationGuard } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export const GUEST_ONLY = new Set(['home', 'login', 'register'])

/**
 * 全局路由守卫：
 * - 首次导航等待身份恢复完成（并发共享同一 Promise）。
 * - 受保护页面仅在“明确未登录”时跳登录页；恢复失败（网络/503）放行，由页面展示可重试错误。
 * - 已登录访问公开页（首页/登录/注册）统一转工作台。
 */
export const authGuard: NavigationGuard = async (to) => {
  const auth = useAuthStore()

  if (auth.isInitializing) {
    await auth.restore()
  }

  if (to.meta.requiresAuth) {
    if (auth.status === 'unauthenticated') {
      return { name: 'login', query: { redirect: to.fullPath } }
    }
    return true
  }

  if (GUEST_ONLY.has(String(to.name)) && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }

  return true
}
