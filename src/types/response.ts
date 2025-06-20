import type { PostCard } from './index'
import type { FollowUser } from './index'
export interface UserInfoResponse {
  code: number
  msg: string
  data: {
    username: string
    email: string
    avatar: string
    bio: string
    birthday: string
    followCount: number
    fanCount: number
    likedCount: number
    gender: number // 性别: 1-男, 2-女, 0-未知
    isFollowed?: boolean // 是否已关注
    userId: number // 用户ID
  }
}
export interface MyPostsResponse {
  code: number
  msg: string
  data: PostCard[]
}
export interface MyFavPostsResponse {
  code: number
  msg: string
  data: {
    records: PostCard[]
    total: number
    size: number
    current: number
    pages: number
  }
}
// 获取关注列表的响应类型
export interface FollowListResponse {
  code: number
  msg: string
  data: {
    records: FollowUser[]
    total: number
    current: number
    size: number
    pages: number
  }
}
