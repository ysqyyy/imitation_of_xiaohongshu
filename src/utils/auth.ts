import Cookies from 'js-cookie'
import { logout } from '@/api/auth'
// token相关的工具函数
export const auth = {
  // 获取token
  getToken: () => {
    return Cookies.get('token')
  },

  // 设置token
  setToken: (token: string, expires = 7) => {
    return Cookies.set('token', token, { expires })
  },

  // 删除token
  removeToken: () => {
    return Cookies.remove('token')
  },

  // 检查是否已登录
  isLoggedIn: () => {
    return !!Cookies.get('token')
  },

  // 登出
  logout: async () => {
    Cookies.remove('token')
    // 清除本地存储的用户信息
    localStorage.removeItem('userInfo')
    //todo: 调用后端登出接口
    // await logout()
    // 注意：不再执行重定向，由调用方自行处理
    return true
  },

  // 刷新token (如果后端提供了刷新token的接口)
  refreshToken: async () => {
    try {
      // 这里应该调用刷新token的API
      // 例如：const response = await request.post('/api/refresh-token');
      // 暂时模拟一个刷新成功的情况
      return true
    } catch (error) {
      console.error('刷新token失败', error)
      return false
    }
  },
}

export default auth
