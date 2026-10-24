/** 账号相关类型，字段与后端 `schemas/auth.py` 的用户响应保持一致。 */

export interface User {
  id: string
  email: string
  display_name: string
  role: string
}

export interface RegisterInput {
  email: string
  password: string
  display_name: string
}

export interface LoginInput {
  email: string
  password: string
}
