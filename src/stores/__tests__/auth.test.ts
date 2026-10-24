import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import * as authApi from '@/api/auth'
import { useAuthStore } from '@/stores/auth'

function jsonResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as unknown as Response
}

function deferredResponse() {
  let resolve!: (r: Response) => void
  let reject!: (e: unknown) => void
  const promise = new Promise<Response>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

const user = { id: 'u-1', email: 'reader@example.com', display_name: '林一舟', role: 'user' }

beforeEach(() => {
  setActivePinia(createPinia())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('restore（会话恢复）', () => {
  it('me 成功 → authenticated', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(200, user)))
    const store = useAuthStore()

    await store.restore()

    expect(store.status).toBe('authenticated')
    expect(store.user).toEqual(user)
  })

  it('me 401 → unauthenticated（未登录）', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(401, { message: '未认证' })))
    const store = useAuthStore()

    await store.restore()

    expect(store.status).toBe('unauthenticated')
    expect(store.user).toBeNull()
  })

  it('me 503 → restore-error（服务异常，不当未登录）', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse(503, { message: '鉴权服务未启用' })),
    )
    const store = useAuthStore()

    await store.restore()

    expect(store.status).toBe('restore-error')
    expect(store.restoreError).toBe('服务暂时不可用，请稍后重试')
  })

  it('网络失败 → restore-error', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new TypeError('fetch failed'))))
    const store = useAuthStore()

    await store.restore()

    expect(store.status).toBe('restore-error')
  })

  it('并发恢复请求去重：只发起一次 me', async () => {
    const fetchMock = vi.fn(async () => jsonResponse(200, user))
    vi.stubGlobal('fetch', fetchMock)
    const store = useAuthStore()

    await Promise.all([store.restore(), store.restore(), store.restore()])

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(store.status).toBe('authenticated')
  })
})

describe('login / logout', () => {
  it('login 成功 → authenticated', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(200, user)))
    const store = useAuthStore()

    await store.login({ email: 'reader@example.com', password: 'password' })

    expect(store.status).toBe('authenticated')
    expect(store.user).toEqual(user)
  })

  it('login 失败（401 凭据错误）→ 抛错且状态不变', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse(401, { message: '邮箱或密码错误' })),
    )
    const store = useAuthStore()

    await expect(
      store.login({ email: 'reader@example.com', password: 'wrong' }),
    ).rejects.toThrow()

    expect(store.status).toBe('initializing')
    expect(store.user).toBeNull()
  })

  it('logout 成功 → unauthenticated', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(200, user)))
    const store = useAuthStore()
    await store.login({ email: 'reader@example.com', password: 'password' })

    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(204, null)))
    await store.logout()

    expect(store.status).toBe('unauthenticated')
    expect(store.user).toBeNull()
  })

  it('logout 失败（503）→ 抛错且保持已登录（不得显示成功）', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(200, user)))
    const store = useAuthStore()
    await store.login({ email: 'reader@example.com', password: 'password' })

    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(503, { message: '服务不可用' })))
    await expect(store.logout()).rejects.toThrow()

    expect(store.status).toBe('authenticated')
    expect(store.user).toEqual(user)
  })
})

describe('注册不自动登录', () => {
  it('register 成功后不写入会话，me 仍为 401', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(201, user))
      .mockResolvedValueOnce(jsonResponse(401, { message: '未认证' }))
    vi.stubGlobal('fetch', fetchMock)
    const store = useAuthStore()

    const registered = await authApi.register({
      email: 'reader@example.com',
      password: 'password',
      display_name: '林一舟',
    })

    expect(registered.email).toBe('reader@example.com')
    // register 不改变会话状态
    expect(store.user).toBeNull()
    expect(store.status).toBe('initializing')

    // 恢复身份：没有会话 Cookie → 明确未登录
    await store.restore()
    expect(store.status).toBe('unauthenticated')
  })
})

describe('restore 与 login/logout 的竞态', () => {
  const userA = { id: 'u-a', email: 'a@example.com', display_name: '账号A', role: 'user' }
  const userB = { id: 'u-b', email: 'b@example.com', display_name: '账号B', role: 'user' }

  function fetchRouter(routes: Record<string, () => Promise<Response>>) {
    return vi.fn(async (url: unknown) => {
      const u = String(url)
      for (const [segment, handler] of Object.entries(routes)) {
        if (u.includes(segment)) return handler()
      }
      throw new Error(`unexpected url: ${u}`)
    })
  }

  it('过期 me 401 不覆盖新登录身份', async () => {
    const meDeferred = deferredResponse()
    vi.stubGlobal(
      'fetch',
      fetchRouter({
        '/auth/me': () => meDeferred.promise,
        '/auth/login': async () => jsonResponse(200, userB),
      }),
    )
    const store = useAuthStore()

    const restoring = store.restore()
    await store.login({ email: userB.email, password: 'password' })
    meDeferred.resolve(jsonResponse(401, { message: '未认证' }))
    await restoring

    expect(store.status).toBe('authenticated')
    expect(store.user).toEqual(userB)
  })

  it('过期 me 返回账号 A 不覆盖新登录的账号 B', async () => {
    const meDeferred = deferredResponse()
    vi.stubGlobal(
      'fetch',
      fetchRouter({
        '/auth/me': () => meDeferred.promise,
        '/auth/login': async () => jsonResponse(200, userB),
      }),
    )
    const store = useAuthStore()

    const restoring = store.restore()
    await store.login({ email: userB.email, password: 'password' })
    meDeferred.resolve(jsonResponse(200, userA))
    await restoring

    expect(store.status).toBe('authenticated')
    expect(store.user).toEqual(userB)
  })

  it('过期 me 503 不覆盖为 restore-error', async () => {
    const meDeferred = deferredResponse()
    vi.stubGlobal(
      'fetch',
      fetchRouter({
        '/auth/me': () => meDeferred.promise,
        '/auth/login': async () => jsonResponse(200, userB),
      }),
    )
    const store = useAuthStore()

    const restoring = store.restore()
    await store.login({ email: userB.email, password: 'password' })
    meDeferred.resolve(jsonResponse(503, { message: '服务不可用' }))
    await restoring

    expect(store.status).toBe('authenticated')
    expect(store.restoreError).toBeNull()
  })

  it('过期 me 网络失败不覆盖为 restore-error', async () => {
    const meDeferred = deferredResponse()
    vi.stubGlobal(
      'fetch',
      fetchRouter({
        '/auth/me': () => meDeferred.promise,
        '/auth/login': async () => jsonResponse(200, userB),
      }),
    )
    const store = useAuthStore()

    const restoring = store.restore()
    await store.login({ email: userB.email, password: 'password' })
    meDeferred.reject(new TypeError('fetch failed'))
    await restoring

    expect(store.status).toBe('authenticated')
    expect(store.restoreError).toBeNull()
  })

  it('过期 me 在成功退出后不重新写回身份', async () => {
    const meDeferred = deferredResponse()
    vi.stubGlobal(
      'fetch',
      fetchRouter({
        '/auth/me': () => meDeferred.promise,
        '/auth/login': async () => jsonResponse(200, userB),
        '/auth/logout': async () => jsonResponse(204, null),
      }),
    )
    const store = useAuthStore()

    await store.login({ email: userB.email, password: 'password' })
    const restoring = store.restore()
    await store.logout()
    meDeferred.resolve(jsonResponse(200, userB))
    await restoring

    expect(store.status).toBe('unauthenticated')
    expect(store.user).toBeNull()
  })
})
