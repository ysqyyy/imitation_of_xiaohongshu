import request from '@/utils/request'
import type { LoginRequest, RegisterRequest, LoginResponse, RegisterResponse } from '@/types/auth'

// 用户登录
export function login(data: LoginRequest): Promise<LoginResponse> {
  return request
    .post('/auth/login', data)
    .then((res: any) => {
      console.log('登录响应:', res)
      return res.data || res
    })
    .catch((err) => {
      console.error('登录失败', err)
      throw err
    })
}

// 用户注册
export function register(data: RegisterRequest): Promise<RegisterResponse> {
  return request
    .post('/auth/register', data)
    .then((res: any) => {
      console.log('注册响应:', res)
      return res.data || res
    })
    .catch((err) => {
      console.error('注册失败', err)
      throw err
    })
}

// 用户登出
export function logout(): Promise<any> {
  return request
    .post('/auth/logout')
    .then((res: any) => {
      console.log('登出响应:', res)
      return res.data || res
    })
    .catch((err) => {
      console.error('登出失败', err)
      throw err
    })
}

// 验证token
export function verifyToken(token: string): Promise<any> {
  return request
    .get('/auth/verify', { 
      headers: { 
        Authorization: `Bearer ${token}` 
      } 
    })
    .then((res: any) => {
      console.log('验证token响应:', res)
      return res.data || res
    })
    .catch((err) => {
      console.error('验证token失败', err)
      throw err
    })
} 