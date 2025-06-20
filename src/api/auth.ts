// src\api\auth.ts
import request from '@/utils/request'
import type { LoginRequest, RegisterRequest, AuthUserInfo } from '@/types/auth'
import type { Result } from '@/utils/request'
import { getOssImageUrl } from '@/utils/oss'
import auth from '@/utils/auth'
// 用户登录 ok
export async function login(data: LoginRequest): Promise<AuthUserInfo> {
  const req = {
    account: data.email,
    password: data.password,
  }
  try {
    const res = await request.post<AuthUserInfo>('http://localhost:8888/user/login', req)
    console.log('登录响应:', res)
    auth.setToken(res.data.token) // 假设返回的token在data中
    res.data.user.avatar = await getOssImageUrl(res.data.user.avatar) // 转换头像地址

    // 确保存储用户头像和用户名
    const userInfo = {
      ...res.data.user,
      // 确保用户名和头像字段存在
      username: (res.data.user as any).username || (res.data.user as any).name || '用户',
      avatar: (res.data.user as any).avatar || (res.data.user as any).img || '/src/assets/logo.svg',
    }

    localStorage.setItem('userInfo', JSON.stringify(userInfo)) // 存储用户信息
    console.log('用户信息已存储:', userInfo)

    if (res.code !== 200) {
      throw new Error(res.msg || '登录失败')
    }
    return res.data
  } catch (err) {
    console.error('登录失败', err)
    throw err
  }
}

// 用户注册
export async function register(data: RegisterRequest): Promise<AuthUserInfo> {
  const req = {
    username: data.username,
    account: data.email, // 后端使用 account 字段
    password: data.password,
    // 不需要发送 confirmPassword 到后端
  }
  try {
    const res: Result<AuthUserInfo> = await request.post<AuthUserInfo>('user/register', req)
    console.log('注册响应:', res)

    if (res.code !== 200) {
      throw new Error(res.msg || '注册失败')
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
    const res = await request.post<Record<string, never>>('http://localhost:8888/user/logout')
    console.log('登出响应:', res)

    if (res.code !== 200) {
      throw new Error(res.msg || '登出失败')
    }
  } catch (err) {
    console.error('登出失败', err)
    throw err
  }
}

// 验证token
export async function verifyToken(token: string): Promise<AuthUserInfo> {
  try {
    const res: Result<AuthUserInfo> = await request.get<AuthUserInfo>('/auth/verify', undefined, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log('验证token响应:', res)

    if (res.code !== 200) {
      throw new Error(res.msg || '验证token失败')
    }

    return res.data
  } catch (err) {
    console.error('验证token失败', err)
    throw err
  }
}
