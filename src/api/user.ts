import request from '@/utils/request'
import type { UserInfo } from '@/types/user'
// 获取用户信息ok
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

// 获取其他用户的信息ok
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
// 关注用户ok
/**
 * @param userId 用户ID
 * @return 成功或失败信息
 */
export async function followUser(userId: number) {
  try {
    const res = await request.post('/user/follow', { userId })
    return res
  } catch (error) {
    console.error('Error following user:', error)
    throw error
  }
}
// 取消关注用户ok
/**
 * @param userId 用户ID
 * @return 成功或失败信息
 */
export async function unfollowUser(userId: number) {
  try {
    const res = await request.delete('/user/follow', { params: { userId } })
    return res
  } catch (error) {
    console.error('Error unfollowing user:', error)
    throw error
  }
}
