import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, apiRequest, isServiceError, isUnauthorized } from '@/utils/request'

function jsonResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as unknown as Response
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('apiRequest', () => {
  it('204 返回 undefined，不解析响应体，写请求携带凭据与请求头', async () => {
    const fetchMock = vi.fn(async () => jsonResponse(204, null))
    vi.stubGlobal('fetch', fetchMock)

    const result = await apiRequest<void>('/auth/logout', { method: 'POST' })

    expect(result).toBeUndefined()
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit | undefined
    expect(init?.credentials).toBe('include')
    expect((init?.headers as Record<string, string>)?.['X-Yiban-Request']).toBe('1')
  })

  it('200 直接返回解析后的身份对象', async () => {
    const user = { id: '1', email: 'a@b.com', display_name: 'A', role: 'user' }
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(200, user)))

    await expect(apiRequest('/auth/me')).resolves.toEqual(user)
  })

  it('401 抛 ApiError：isUnauthorized=true 且 isServiceError=false', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse(401, { code: 1001, message: '未认证' })),
    )

    const err = await apiRequest('/auth/me').catch((e: unknown) => e)
    expect(err).toBeInstanceOf(ApiError)
    expect((err as ApiError).status).toBe(401)
    expect(isUnauthorized(err)).toBe(true)
    expect(isServiceError(err)).toBe(false)
  })

  it('503 使用安全通用提示，isServiceError=true 且 isUnauthorized=false', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse(503, { code: 503, message: '鉴权服务未启用' })),
    )

    const err = await apiRequest('/auth/me').catch((e: unknown) => e)
    expect((err as ApiError).status).toBe(503)
    expect((err as ApiError).message).toBe('服务暂时不可用，请稍后重试')
    expect(isServiceError(err)).toBe(true)
    expect(isUnauthorized(err)).toBe(false)
  })

  it('网络失败抛 status=0，isServiceError=true', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new TypeError('fetch failed'))))

    const err = await apiRequest('/auth/me').catch((e: unknown) => e)
    expect((err as ApiError).status).toBe(0)
    expect(isServiceError(err)).toBe(true)
  })
})
