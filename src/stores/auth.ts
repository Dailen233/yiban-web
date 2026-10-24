import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import * as authApi from '@/api/auth'
import type { LoginInput, User } from '@/types/auth'
import { isUnauthorized, toApiError } from '@/utils/request'

/**
 * 会话状态：
 * - `initializing`：身份尚未确认（恢复中或尚未开始）
 * - `authenticated`：me 成功，已登录
 * - `unauthenticated`：me 返回 401，明确未登录
 * - `restore-error`：恢复遇到网络/服务异常，可重试，不当作“未登录”
 */
export type AuthStatus = 'initializing' | 'authenticated' | 'unauthenticated' | 'restore-error'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const status = ref<AuthStatus>('initializing')
  const restoreError = ref<string | null>(null)

  /** 并发恢复请求去重：进行中的恢复共享同一个 Promise。 */
  let restorePromise: Promise<void> | null = null

  const isAuthenticated = computed(() => status.value === 'authenticated')
  const isInitializing = computed(() => status.value === 'initializing')

  async function doRestore(): Promise<void> {
    status.value = 'initializing'
    restoreError.value = null
    try {
      user.value = await authApi.me()
      status.value = 'authenticated'
    } catch (err) {
      user.value = null
      if (isUnauthorized(err)) {
        status.value = 'unauthenticated'
      } else {
        status.value = 'restore-error'
        restoreError.value = toApiError(err).message
      }
    }
  }

  function restore(): Promise<void> {
    if (restorePromise) return restorePromise
    restorePromise = doRestore().finally(() => {
      restorePromise = null
    })
    return restorePromise
  }

  async function login(input: LoginInput): Promise<void> {
    user.value = await authApi.login(input)
    status.value = 'authenticated'
    restoreError.value = null
  }

  async function logout(): Promise<void> {
    await authApi.logout()
    user.value = null
    status.value = 'unauthenticated'
    restoreError.value = null
  }

  return {
    user,
    status,
    restoreError,
    isAuthenticated,
    isInitializing,
    restore,
    login,
    logout,
  }
})
