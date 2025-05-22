import request from '@/utils/request'
import type { UserInfo } from '@/types/user'
// 获取用户信息
export async function getUserInfo() {
  try {
    const res = await request.get('/user/getuserinfo')
    const user: UserInfo = res.data
    return user
  } catch (error) {
    console.error('Error fetching user info:', error)
    throw error
  }
}
