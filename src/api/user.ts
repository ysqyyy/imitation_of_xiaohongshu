import request from '@/utils/request'
import type { UserInfo, PostCard } from '@/types'
import { getOssImageUrl } from '@/utils/oss'
// 获取用户信息  ok
export async function getUserInfo() {
  try {
    const res = await request.get('http://localhost:8888/user/getUserInfo')
    res.data.avatar = await getOssImageUrl(res.data.avatar) // 转换头像地址
    console.log('获取用户信息响应:', res)
    const mypost = await getMyPosts() // 获取当前用户的帖子列表
    const myfavposts = await getMyFavPosts() // 获取当前用户的收藏帖子列表
    console.log('获取我的收藏帖子列表响应:', myfavposts)
    const user: UserInfo = {
      name: res.data.username,
      id: res.data.email,
      img: res.data.avatar,
      desc: res.data.bio,
      follow: res.data?.followCount,
      fans: res.data?.fanCount,
      likes: res.data?.likedCount,
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
    res.data.avatar = await getOssImageUrl(res.data.avatar) // 转换头像地址

    console.log('获取其他用户信息响应1:', res)
    const user: UserInfo = {
      name: res.data.username,
      id: res.data.account,
      img: res.data.avatar,
      desc: res.data.bio,
      isFollowed: res.data.isFollowed, // 是否已关注
      follow: res.data?.followCount || 0,
      fans: res.data?.fanCount || 0,
      likes: res.data?.likedCount || 0,
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
    //转换oss图片地址  ok
    await Promise.all(
      res.data.map(async (item: any) => {
        item.img = await getOssImageUrl(item.img)
        // 如有多个字段需要异步赋值，也可以在这里加
      }),
    )
    //转换作者头像地址 ok
    await Promise.all(
      res.data.map(async (item: any) => {
        if (item.author && item.author.img) {
          item.author.img = await getOssImageUrl(item.author.img)
        }
      }),
    )
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
    //转换oss图片地址 ok
    await Promise.all(
      res.data.records.map(async (item: any) => {
        item.img = await getOssImageUrl(item.img)
        // 如有多个字段需要异步赋值，也可以在这里加
      }),
    )
    //转换作者头像地址 ok
    await Promise.all(
      res.data.records.map(async (item: any) => {
        if (item.author && item.author.img) {
          item.author.img = await getOssImageUrl(item.author.img)
        }
      }),
    )
    console.log('获取我的收藏帖子列表响应1:', res)
    return res.data.records
  } catch (error) {
    console.error('获取我的帖子列表失败:', error)
    throw error
  }
}
import axios from 'axios'
import auth from '@/utils/auth'
/**
 * 更新用户信息
 * @param userInfo 用户信息对象或FormData
 */
export async function updateUserInfo(userInfo: FormData) {
  try {
    const res = await axios.put('http://localhost:8888/user/update', userInfo, {
      headers: {
        'Content-Type': 'multipart/form-data', // 确保使用正确的Content-Type
        Authorization: `Bearer ${auth.getToken()}`, // 添加token到请求头
      },
    })

    console.log('更新用户信息响应:', res)
    return res.data
  } catch (error) {
    console.error('更新用户信息失败:', error)
    throw error
  }
}

/**
 * 修改用户密码   ok
 * @param passwordInfo 包含旧密码和新密码的对象
 */
export async function updatePassword(passwordInfo: { oldPassword: string; newPassword: string }) {
  try {
    const res = await request.put('http://localhost:8888/user/updatePassword', passwordInfo)
    console.log('修改密码响应:', res)
    return res.data
  } catch (error) {
    console.error('修改密码失败:', error)
    throw error
  }
}
