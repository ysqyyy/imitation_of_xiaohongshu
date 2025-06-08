import request from '@/utils/request'
import type { LoginRequest, RegisterRequest, RegisterResponse, AuthUserInfo } from '@/types/auth'

// 用户登录
export async function login(data: LoginRequest): Promise<AuthUserInfo> {
  const req = {
    account: data.email,
    password: data.password,
  }
  try {
    const res = await request.post<AuthUserInfo>('http://localhost:8888/user/login', req)
    console.log('登录响应:', res)

    if (res.code !== 200) {
      throw new Error(res.message || '登录失败')
    }
    return res.data
  } catch (err) {
    console.error('登录失败', err)
    throw err
  }
}

// 用户注册
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  try {
    const res = await request.post<RegisterResponse>('/auth/register', data)
    console.log('注册响应:', res)

    if (res.code !== 200) {
      throw new Error(res.message || '注册失败')
    }

    return res.data
  } catch (err) {
    console.error('注册失败', err)
    throw err
  }
}

// 用户登出
export async function logout(): Promise<void> {
  try {
    const res = await request.post<Record<string, never>>('/auth/logout')
    console.log('登出响应:', res)

    if (res.code !== 200) {
      throw new Error(res.message || '登出失败')
    }
  } catch (err) {
    console.error('登出失败', err)
    throw err
  }
}

// 验证token
export async function verifyToken(token: string): Promise<AuthUserInfo> {
  try {
    const res = await request.get<AuthUserInfo>('/auth/verify', undefined, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log('验证token响应:', res)

    if (res.code !== 200) {
      throw new Error(res.message || '验证token失败')
    }

    return res.data
  } catch (err) {
    console.error('验证token失败', err)
    throw err
  }
}
