import request from '@/utils/request'
import type { UserInfo } from '@/types'
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

// 获取其他用户的信息
/**
 * @param userId 用户ID
 * @return UserInfo 用户信息
 */
export async function getOtherUserInfo(userId: number) {
  try {
    const res = await request.get(`/user/${userId}`)
    const user: UserInfo = res.data
    return user
  } catch (error) {
    console.error('Error fetching other user info:', error)
    throw error
  }
}
// 关注用户 ok
export async function followUser(userId: number) {
  try {
    const res = await request.post(`http://localhost:8888/userFollows/follow?userId=${userId}`)
    console.log('关注用户响应:', res)
    return res
  } catch (error) {
    console.error('Error following user:', error)
    throw error
  }
}
// 取消关注用户 ok
export async function unfollowUser(userId: number) {
  try {
    const res = await request.delete(`http://localhost:8888/userFollows/follow?userId=${userId}`)
    console.log('取消关注用户响应:', res)
    return res
  } catch (error) {
    console.error('Error unfollowing user:', error)
    throw error
  }
}
