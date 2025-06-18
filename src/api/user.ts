import request from '@/utils/request'
import type { UserInfo, PostCard } from '@/types'
// 获取用户信息  todo ok
export async function getUserInfo() {
  try {
    const res = await request.get('http://localhost:8888/user/getUserInfo')
    const mypost = await getMyPosts() // 获取当前用户的帖子列表
    const myfavposts = await getMyFavPosts() // 获取当前用户的收藏帖子列表
    console.log('获取我的收藏帖子列表响应:', myfavposts)
    const user: UserInfo = {
      name: res.data.username,
      id: res.data.account,
      img: res.data.avatar,
      desc: res.data.bio,
      follow: res.data?.followingCount || 0,
      fans: res.data?.followerCount || 0,
      likes: res.data?.likesCount || 0,
      myPosts: mypost, // 使用获取的帖子列表
      favPosts: myfavposts, // 使用获取的收藏帖子列表
    }
    console.log('获取用户信息响应:', user)
    return user
  } catch (error) {
    console.error('Error fetching user info:', error)
    throw error
  }
}

// 获取其他用户的信息 todo ok
export async function getOtherUserInfo(userId: number) {
  try {
    const res = await request.get(`http://localhost:8888/user/${userId}`)
    console.log('获取其他用户信息响应:', res)
    const user: UserInfo = {
      name: res.data.username,
      id: res.data.account,
      img: res.data.avatar,
      desc: res.data.bio,
      follow: res.data?.followingCount || 0,
      fans: res.data?.followerCount || 0,
      likes: res.data?.likesCount || 0,
    }
    console.log('获取其他用户信息:', user)
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

/**
 * 获取我的帖子列表 ok
 */
export async function getMyPosts(page: number = 1, limit: number = 10) {
  try {
    const res = await request.get('http://localhost:8888/posts/my')
    console.log('获取我的帖子列表响应:', res)
    return res.data
  } catch (error) {
    console.error('获取我的帖子列表失败:', error)
    throw error
  }
}
/**
 * 获取我的收藏帖子列表 ok
 */
export async function getMyFavPosts(page: number = 1, limit: number = 10) {
  try {
    const res = await request.get('http://localhost:8888/userCollects/list')
    console.log('获取我的收藏帖子列表响应1:', res)
    return res.data.records
  } catch (error) {
    console.error('获取我的帖子列表失败:', error)
    throw error
  }
}
