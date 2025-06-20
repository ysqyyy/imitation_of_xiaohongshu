import request from '@/utils/request'
import type { UserInfo, PostCard } from '@/types'
import { getOssImageUrl, getOssImageUrls } from '@/utils/oss'
import axios from 'axios'
import auth from '@/utils/auth'
// 获取用户信息  ok
export async function getUserInfo() {
  try {
    const res = await request.get('http://localhost:8888/user/getUserInfo')
    res.data.avatar = await getOssImageUrl(res.data.avatar) // 转换头像地址
    console.log('获取用户信息响应:', res)
    const mypost = await getMyPosts() // 获取当前用户的帖子列表
    const myfavposts = await getMyFavPosts() // 获取当前用户的收藏帖子列表
    const user: UserInfo = {
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
export async function getOtherUserInfo(userId: number) {
  try {
    const res = await request.get(`http://localhost:8888/user/${userId}`)
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
export async function getMyPosts(page: number = 1, limit: number = 100) {
  try {
    const res = await request.get('http://localhost:8888/posts/my', {
      page,
      size: limit,
    })
    console.log('获取我的帖子列表响应:', res)
    //转换oss图片地址  ok
    await Promise.all(
      res.data.map(async (item: any) => {
        item.img = await getOssImageUrl(item.img)
        if (item.author && item.author.img) {
          item.author.img = await getOssImageUrl(item.author.img)
        }
      }),
    )
    return res.data
  } catch (error) {
    console.error('获取我的帖子列表失败:', error)
    throw error
  }
}
//获取我的收藏帖子列表 ok
export async function getMyFavPosts(page: number = 1, limit: number = 100) {
  try {
    const res = await request.get('http://localhost:8888/userCollects/list', {
      page,
      size: limit,
    })
    console.log('获取我的收藏帖子列表响应:', res)
    //转换oss图片地址 ok
    await Promise.all(
      res.data.records.map(async (item: any) => {
        item.img = await getOssImageUrl(item.img)
        if (item.author && item.author.img) {
          item.author.img = await getOssImageUrl(item.author.img)
        }
      }),
    )
    return res.data.records
  } catch (error) {
    console.error('获取我的帖子列表失败:', error)
    throw error
  }
}

/**
 * 更新用户信息  ok
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

/**
 * 获取其他用户的帖子列表(分页) todo
 * @param userId 用户ID
 * @param page 页码
 * @param limit 每页数量
 * @returns 帖子列表
 */
export async function getUserPosts(
  userId: number,
  page: number = 1,
  limit: number = 9,
): Promise<{
  list: PostCard[]
  total: number
  hasMore: boolean
}> {
  try {
    const res = await request.get(`http://localhost:8888/posts/sb`, {
      userId,
      page,
      size: limit,
    })
    console.log('获取用户帖子列表响应1:', res)
    // 获取帖子数据
    const list = res.data || []
    const total = res.data.length || 0
    const hasMore = page * limit <= total

    // 批量转换OSS图片地址
    const imgUrls = list.map((item: any) => item.img).filter(Boolean)
    const authorImgUrls = list.map((item: any) => item.author?.img).filter(Boolean)

    // 批量获取OSS URL
    const convertedImgUrls = await getOssImageUrls(imgUrls)
    const convertedAuthorImgUrls = await getOssImageUrls(authorImgUrls)

    // 更新帖子图片
    list.forEach((item: any, index: number) => {
      if (item.img && convertedImgUrls[index]) {
        item.img = convertedImgUrls[index]
      }
    })

    // 更新作者头像
    let authorImgIndex = 0
    list.forEach((item: any) => {
      if (item.author && item.author.img) {
        item.author.img = convertedAuthorImgUrls[authorImgIndex++]
      }
    })

    console.log('获取用户帖子列表:', { list, total, hasMore, page, limit })
    return { list, total, hasMore }
  } catch (error) {
    console.error('获取用户帖子列表失败:', error)
    // 出错时返回空数据
    return { list: [], total: 0, hasMore: false }
  }
}
