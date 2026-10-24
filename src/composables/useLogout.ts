import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toApiError } from '@/utils/request'

/**
 * 退出登录：成功清理身份并转登录页；失败保留登录态并给出可重试提示，
 * 绝不把失败显示为成功。
 */
export function useLogout() {
  const auth = useAuthStore()
  const router = useRouter()

  const pending = ref(false)
  const error = ref<string | null>(null)

  async function logout(): Promise<void> {
    if (pending.value) return
    pending.value = true
    error.value = null
    try {
      await auth.logout()
      await router.push({ name: 'login' })
    } catch (err) {
      error.value = toApiError(err).message
    } finally {
      pending.value = false
    }
  }

  return { pending, error, logout }
}
