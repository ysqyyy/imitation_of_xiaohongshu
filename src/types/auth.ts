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

// 登录响应数据
export interface LoginResponse {
  success: boolean
  message?: string
  token: string
  userInfo: AuthUserInfo
}

// 注册响应数据
export interface RegisterResponse {
  success: boolean
  message?: string
  userInfo?: AuthUserInfo
}

// 认证用户信息
export interface AuthUserInfo {
  id: string
  username: string
  email: string
  avatar?: string
  isLoggedIn: boolean
}
