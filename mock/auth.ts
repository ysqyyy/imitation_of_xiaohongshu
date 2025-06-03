import type { MockMethod } from 'vite-plugin-mock'

// 模拟用户数据库
const users = [
  {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: '123456',
    avatar: 'https://picsum.photos/100/100?random=1'
  }
]

// 模拟token存储
let tokens: { [key: string]: any } = {}

// 生成随机token
function generateToken(userId: number): string {
  const token = `token_${userId}_${Date.now()}`
  tokens[token] = {
    userId,
    createdAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7天过期
  }
  return token
}

// 验证token
function verifyToken(token: string) {
  const tokenData = tokens[token]
  if (!tokenData) return null
  
  if (Date.now() > tokenData.expiresAt) {
    delete tokens[token]
    return null
  }
  
  return tokenData
}

export default [
  // 用户登录
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }: { body: any }) => {
      const { email, password } = body
      
      // 查找用户
      const user = users.find(u => u.email === email)
      
      if (!user) {
        return {
          code: 401,
          message: '用户不存在',
          success: false,
          data: null
        }
      }
      
      if (user.password !== password) {
        return {
          code: 401,
          message: '密码错误',
          success: false,
          data: null
        }
      }
      
      // 生成token
      const token = generateToken(user.id)
      
      return {
        code: 200,
        message: '登录成功',
        success: true,
        data: {
          token,
          userInfo: {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar
          }
        }
      }
    }
  },
  
  // 用户注册
  {
    url: '/api/auth/register',
    method: 'post',
    response: ({ body }: { body: any }) => {
      const { username, email, password } = body
      
      // 检查邮箱是否已存在
      const existingUser = users.find(u => u.email === email)
      if (existingUser) {
        return {
          code: 400,
          message: '邮箱已被注册',
          success: false,
          data: null
        }
      }
      
      // 创建新用户
      const newUser = {
        id: users.length + 1,
        username,
        email,
        password,
        avatar: `https://picsum.photos/100/100?random=${users.length + 1}`
      }
      
      users.push(newUser)
      
      return {
        code: 200,
        message: '注册成功',
        success: true,
        data: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          avatar: newUser.avatar
        }
      }
    }
  },
  
  // 用户登出
  {
    url: '/api/auth/logout',
    method: 'post',
    response: ({ headers }: { headers: any }) => {
      const authorization = headers.authorization
      if (authorization) {
        const token = authorization.replace('Bearer ', '')
        delete tokens[token]
      }
      
      return {
        code: 200,
        message: '登出成功',
        success: true,
        data: null
      }
    }
  },
  
  // 验证token
  {
    url: '/api/auth/verify',
    method: 'get',
    response: ({ headers }: { headers: any }) => {
      const authorization = headers.authorization
      if (!authorization) {
        return {
          code: 401,
          message: '未提供token',
          success: false,
          data: null
        }
      }
      
      const token = authorization.replace('Bearer ', '')
      const tokenData = verifyToken(token)
      
      if (!tokenData) {
        return {
          code: 401,
          message: 'token无效或已过期',
          success: false,
          data: null
        }
      }
      
      // 查找用户信息
      const user = users.find(u => u.id === tokenData.userId)
      if (!user) {
        return {
          code: 401,
          message: '用户不存在',
          success: false,
          data: null
        }
      }
      
      return {
        code: 200,
        message: 'token有效',
        success: true,
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar
        }
      }
    }
  }
] as MockMethod[] 