// src\types\auth.ts
// 登录请求参数
export interface LoginRequest {
  email: string
  password: string
}

// 注册请求参数
export interface RegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
}

// 用户信息
export interface UserInfo {
  userId: number
  username: string
  account: string
  password: null
  avatar: string | null
  bio: string
  gender: number
  birthday: string | null
  phone: string | null
  email: string
  status: number
  createdAt: string
}

// 认证响应数据（登录和注册成功后的返回数据）
export interface AuthUserInfo {
  user: UserInfo
  token: string
}
