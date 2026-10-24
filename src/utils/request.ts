/**
 * 统一请求入口。
 *
 * - 所有请求携带 `credentials: 'include'`，会话 Cookie 为 HttpOnly，前端不读取令牌。
 * - 写请求（非 GET）携带 `X-Yiban-Request: 1`；Origin 由浏览器随跨域请求自动发送。
 * - 以 HTTP 状态码判断鉴权与错误类型，不把响应体中的业务 `code` 当作 HTTP 状态。
 * - 204 无响应体，不调用 response.json()。
 * - 5xx 使用安全通用提示，不展示后端调试异常原文。
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8001'

export class ApiError extends Error {
  /** HTTP 状态码；网络失败时为 0。 */
  status: number
  /** 响应体中的业务 code（仅诊断用，不作鉴权依据）。 */
  code?: number
  data?: unknown

  constructor(message: string, status: number, code?: number, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.data = data
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST'
  body?: unknown
}

interface ErrorBody {
  code?: number
  message?: string
  data?: unknown
}

function errorMessage(payload: ErrorBody | null, status: number): string {
  if (status >= 500) return '服务暂时不可用，请稍后重试'
  if (status === 422) return '提交的数据不合法，请检查后重试'
  if (payload && typeof payload.message === 'string' && payload.message) {
    return payload.message
  }
  return '请求失败，请稍后重试'
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body } = options
  const isWrite = method !== 'GET'

  const headers: Record<string, string> = {}
  if (isWrite) headers['X-Yiban-Request'] = '1'
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}/api/v1${path}`, {
      method,
      credentials: 'include',
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('无法连接服务器，请检查网络后重试', 0)
  }

  if (response.status === 204) {
    return undefined as T
  }

  let payload: ErrorBody | null = null
  try {
    payload = (await response.json()) as ErrorBody
  } catch {
    payload = null
  }

  if (!response.ok) {
    throw new ApiError(
      errorMessage(payload, response.status),
      response.status,
      payload?.code,
      payload?.data,
    )
  }

  return payload as unknown as T
}

/** 未认证（401）：明确表示尚未登录/会话无效。 */
export function isUnauthorized(err: unknown): boolean {
  return err instanceof ApiError && err.status === 401
}

/** 服务异常（网络失败或 5xx）：可重试，不能当作“未登录”。 */
export function isServiceError(err: unknown): boolean {
  return err instanceof ApiError && (err.status === 0 || err.status >= 500)
}

export function toApiError(err: unknown): ApiError {
  return err instanceof ApiError ? err : new ApiError('请求失败，请稍后重试', 0)
}
