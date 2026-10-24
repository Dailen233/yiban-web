/**
 * 客户端字段校验，规则与后端 `schemas/auth.py`、`utils/validators.py` 保持一致：
 * - 邮箱：strip + lower 规范化后，格式匹配、最长 255 字符
 * - 密码：原样校验（不 trim/lower），至少 8 个 Unicode 字符，UTF-8 不超过 72 字节
 * - 昵称：非空（trim 后）、最长 100 字符
 */

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

/** 与后端 normalize_email 一致：strip + lower。 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/** 按 Unicode 码点计数（与 Python `len(str)` 一致，emoji 等算 1 个字符）。 */
function countChars(value: string): number {
  return [...value].length
}

export function validateEmail(email: string): string | null {
  const normalized = normalizeEmail(email)
  if (!normalized) return '请输入邮箱'
  if (!EMAIL_PATTERN.test(normalized)) return '邮箱格式不正确'
  if (countChars(normalized) > 255) return '邮箱长度不得超过 255 字符'
  return null
}

export function validatePassword(password: string): string | null {
  if (countChars(password) < 8) return '密码至少 8 个字符'
  if (new TextEncoder().encode(password).length > 72) {
    return '密码过长（UTF-8 编码后不得超过 72 字节）'
  }
  return null
}

export function validateDisplayName(name: string): string | null {
  const trimmed = name.trim()
  if (!trimmed) return '昵称不能为空'
  if (countChars(trimmed) > 100) return '昵称长度不得超过 100 字符'
  return null
}
