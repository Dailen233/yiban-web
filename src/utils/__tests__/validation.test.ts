import { describe, expect, it } from 'vitest'
import {
  normalizeEmail,
  validateDisplayName,
  validateEmail,
  validatePassword,
} from '@/utils/validation'

describe('normalizeEmail', () => {
  it('trim 并转小写', () => {
    expect(normalizeEmail('  Foo@Bar.COM ')).toBe('foo@bar.com')
  })
})

describe('validateEmail', () => {
  it('接受合法邮箱', () => {
    expect(validateEmail('user@example.com')).toBeNull()
  })

  it('拒绝空与非法格式', () => {
    expect(validateEmail('')).toBe('请输入邮箱')
    expect(validateEmail('not-an-email')).toBe('邮箱格式不正确')
  })

  it('拒绝超过 255 字符', () => {
    const long = `${'a'.repeat(250)}@b.com`
    expect(validateEmail(long)).toBe('邮箱长度不得超过 255 字符')
  })
})

describe('validatePassword', () => {
  it('至少 8 个 Unicode 字符（emoji 按 1 个字符计）', () => {
    expect(validatePassword('1234567')).toBe('密码至少 8 个字符')
    expect(validatePassword('12345678')).toBeNull()
    expect(validatePassword(`${'a'.repeat(7)}😀`)).toBeNull()
  })

  it('UTF-8 编码后不超过 72 字节', () => {
    expect(validatePassword('😀'.repeat(24))).toBe('密码过长（UTF-8 编码后不得超过 72 字节）')
    expect(validatePassword('a'.repeat(72))).toBeNull()
  })

  it('不 trim（空格计入字符）', () => {
    expect(validatePassword('1234567 ')).toBeNull()
  })
})

describe('validateDisplayName', () => {
  it('非空（trim 后）', () => {
    expect(validateDisplayName('')).toBe('昵称不能为空')
    expect(validateDisplayName('   ')).toBe('昵称不能为空')
  })

  it('最长 100 字符', () => {
    expect(validateDisplayName('林一舟')).toBeNull()
    expect(validateDisplayName('a'.repeat(100))).toBeNull()
    expect(validateDisplayName('a'.repeat(101))).toBe('昵称长度不得超过 100 字符')
  })
})
