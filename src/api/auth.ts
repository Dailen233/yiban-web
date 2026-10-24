import { apiRequest } from '@/utils/request'
import type { LoginInput, RegisterInput, User } from '@/types/auth'

/**
 * 鉴权接口，对应 `yiban-api` 的 `/api/v1/auth/*`。
 * 注册/登录/me 成功直接返回 `{id,email,display_name,role}`，无 data 外层；
 * 退出返回 204，无响应体。
 */
export function register(input: RegisterInput): Promise<User> {
  return apiRequest<User>('/auth/register', { method: 'POST', body: input })
}

export function login(input: LoginInput): Promise<User> {
  return apiRequest<User>('/auth/login', { method: 'POST', body: input })
}

export function me(): Promise<User> {
  return apiRequest<User>('/auth/me')
}

export function logout(): Promise<void> {
  return apiRequest<void>('/auth/logout', { method: 'POST' })
}
