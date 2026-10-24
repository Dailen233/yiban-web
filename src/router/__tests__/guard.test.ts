import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { authGuard } from '@/router/guard'

type GuardTo = Parameters<typeof authGuard>[0]

function jsonResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as unknown as Response
}

const user = { id: 'u-1', email: 'reader@example.com', display_name: '林一舟', role: 'user' }

function to(overrides: Partial<GuardTo> & { meta?: Record<string, unknown> }): GuardTo {
  return {
    name: 'home',
    fullPath: '/',
    meta: {},
    ...overrides,
  } as GuardTo
}

beforeEach(() => {
  setActivePinia(createPinia())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('authGuard', () => {
  it('未登录访问受保护页 → 跳登录页并带 redirect', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(401, { message: '未认证' })))

    const result = await authGuard(
      to({ name: 'dashboard', fullPath: '/dashboard', meta: { requiresAuth: true } }),
    )

    expect(result).toEqual({ name: 'login', query: { redirect: '/dashboard' } })
  })

  it('恢复失败（503）访问受保护页 → 放行（不跳登录）', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(503, { message: '服务不可用' })))

    const result = await authGuard(
      to({ name: 'dashboard', fullPath: '/dashboard', meta: { requiresAuth: true } }),
    )

    expect(result).toBe(true)
  })

  it('已登录访问登录页 → 转工作台', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(200, user)))

    const result = await authGuard(to({ name: 'login', fullPath: '/login' }))

    expect(result).toEqual({ name: 'dashboard' })
  })

  it('已登录访问首页 → 转工作台', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(200, user)))

    const result = await authGuard(to({ name: 'home', fullPath: '/' }))

    expect(result).toEqual({ name: 'dashboard' })
  })

  it('未登录访问首页 → 放行', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(401, { message: '未认证' })))

    const result = await authGuard(to({ name: 'home', fullPath: '/' }))

    expect(result).toBe(true)
  })
})
