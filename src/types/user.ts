// 用户信息类型
export type Post = {
  id: number
  img: string
  postDesc: string
  like: number
  private?: boolean
}

export interface UserInfo {
  username: string
  id: string
  userDesc: string
  follow: number
  fans: number
  likes: number
  myPosts: Post[]
  likedPosts: Post[]
  favPosts: Post[]
}
