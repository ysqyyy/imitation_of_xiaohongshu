import request from '@/utils/request'
import type { UserInfo, PostCard } from '@/types'
import { getOssImageUrl, getOssImageUrls } from '@/utils/oss'
import axios from 'axios'
import auth from '@/utils/auth'
import type { MyFavPostsResponse, MyPostsResponse, UserInfoResponse } from '@/types/response'
// 获取用户信息  ok
export async function getUserInfo(): Promise<UserInfo> {
  try {
    const res: UserInfoResponse = await request.get('http://localhost:8888/user/getUserInfo')
    res.data.avatar = await getOssImageUrl(res.data.avatar) // 转换头像地址
    console.log('获取用户信息响应:', res)
    const mypost = await getMyPosts() // 获取当前用户的帖子列表
    const myfavposts = await getMyFavPosts() // 获取当前用户的收藏帖子列表
    const user: UserInfo = {
      userId: res.data.userId, // 用户类型
      name: res.data.username,
      id: res.data.email,
      img: res.data.avatar,
      desc: res.data.bio,
      birthday: res.data.birthday,
      follow: res.data?.followCount,
      fans: res.data?.fanCount,
      likes: res.data?.likedCount,
      myPosts: mypost, // 使用获取的帖子列表
      favPosts: myfavposts, // 使用获取的收藏帖子列表
      gender: res.data.gender,
    }
    return user
  } catch (error) {
    console.error('Error fetching user info:', error)
    throw error
  }
}

// 获取其他用户的信息 todo ok
export async function getOtherUserInfo(userId: number): Promise<UserInfo> {
  try {
    const res: UserInfoResponse = await request.get(`http://localhost:8888/user/${userId}`)
    res.data.avatar = await getOssImageUrl(res.data.avatar) // 转换头像地址
    console.log('获取其他用户信息响应:', res)
    const user: UserInfo = {
      name: res.data.username,
      id: res.data.email,
      img: res.data.avatar,
      desc: res.data.bio,
      isFollowed: res.data.isFollowed, // 是否已关注
      follow: res.data?.followCount,
      fans: res.data?.fanCount,
      likes: res.data?.likedCount,
      gender: res.data.gender,
      birthday: res.data.birthday,
      userId: res.data.userId, // 用户类型
    }
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

// 获取我的帖子列表 ok
export async function getMyPosts(page: number = 1, limit: number = 100): Promise<PostCard[]> {
  try {
    const res: MyPostsResponse = await request.get('http://localhost:8888/posts/my', {
      page,
      size: limit,
    })
    console.log('获取我的帖子列表响应:', res)
    // 批量转换OSS图片地址
    const imgUrls = res.data.map((item) => item.img).filter(Boolean)
    const authorImgUrls = res.data.map((item) => item.author?.img).filter(Boolean)
    const convertedImgUrls = await getOssImageUrls(imgUrls)
    const convertedAuthorImgUrls = await getOssImageUrls(authorImgUrls)
    res.data.forEach((item, index: number) => {
      if (item.img && convertedImgUrls[index]) {
        item.img = convertedImgUrls[index]
      }
    })
    let authorImgIndex = 0
    res.data.forEach((item) => {
      if (item.author && item.author.img) {
        item.author.img = convertedAuthorImgUrls[authorImgIndex++]
      }
    })
    return res.data
  } catch (error) {
    console.error('获取我的帖子列表失败:', error)
    throw error
  }
}
//获取我的收藏帖子列表 ok
export async function getMyFavPosts(page: number = 1, limit: number = 100): Promise<PostCard[]> {
  try {
    const res: MyFavPostsResponse = await request.get('http://localhost:8888/userCollects/list', {
      page,
      size: limit,
    })
    console.log('获取我的收藏帖子列表响应:', res)
    // 批量转换OSS图片地址
    const imgUrls = res.data.records.map((item) => item.img).filter(Boolean)
    const authorImgUrls = res.data.records.map((item) => item.author?.img).filter(Boolean)
    const convertedImgUrls = await getOssImageUrls(imgUrls)
    const convertedAuthorImgUrls = await getOssImageUrls(authorImgUrls)
    res.data.records.forEach((item, index: number) => {
      if (item.img && convertedImgUrls[index]) {
        item.img = convertedImgUrls[index]
      }
    })
    let authorImgIndex = 0
    res.data.records.forEach((item) => {
      if (item.author && item.author.img) {
        item.author.img = convertedAuthorImgUrls[authorImgIndex++]
      }
    })
    return res.data.records
  } catch (error) {
    console.error('获取我的帖子列表失败:', error)
    throw error
  }
}

// 更新用户信息  ok
export async function updateUserInfo(userInfo: FormData) {
  try {
    const res = await axios.put('http://localhost:8888/user/update', userInfo, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${auth.getToken()}`,
      },
    })
    console.log('更新用户信息响应:', res)
    return res.data
  } catch (error) {
    console.error('更新用户信息失败:', error)
    throw error
  }
}
//修改用户密码   ok
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

// 获取其他用户的帖子列表(分页) ok
export async function getUserPosts(
  userId: number,
  page: number = 1,
  limit: number = 9,
): Promise<PostCard[]> {
  try {
    const res: MyPostsResponse = await request.get(`http://localhost:8888/posts/sb`, {
      userId,
      page,
      size: limit,
    })
    console.log('获取用户帖子列表响应:', res)
    const list = res.data || []

    // 批量转换OSS图片地址
    const imgUrls = list.map((item) => item.img).filter(Boolean)
    const authorImgUrls = list.map((item) => item.author?.img).filter(Boolean)
    // 批量获取OSS URL
    const convertedImgUrls = await getOssImageUrls(imgUrls)
    const convertedAuthorImgUrls = await getOssImageUrls(authorImgUrls)
    // 更新帖子图片
    list.forEach((item, index: number) => {
      if (item.img && convertedImgUrls[index]) {
        item.img = convertedImgUrls[index]
      }
    })
    // 更新作者头像
    let authorImgIndex = 0
    list.forEach((item) => {
      if (item.author && item.author.img) {
        item.author.img = convertedAuthorImgUrls[authorImgIndex++]
      }
    })
    return list
  } catch (error) {
    console.error('获取用户帖子列表失败:', error)
    return []
  }
}
