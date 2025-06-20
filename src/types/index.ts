// 帖子缩略信息
export type PostCard = {
  id: number
  img: string
  title: string
  author: Author
  like: number
  isLike: boolean
  private?: boolean
  tags?: string[]

  video?: string // 视频URL
  type?: 'image' | 'video' // 内容类型
  duration?: number // 视频时长（秒）
}
// 用户信息类型(他人+我的主页)
export interface UserInfo {
  id: string
  name: string
  img: string
  desc: string
  follow: number
  fans: number
  likes: number
  isFollowed?: boolean
  myPosts?: PostCard[]
  likedPosts?: PostCard[]
  favPosts?: PostCard[]
  gender?: number // 性别: 1-男, 2-女, 0-未知
  birthday?: string // 生日
}
//post、comment作者
export type Author = {
  id: number
  name: string
  img: string
  isAuthor?: boolean
  isFollowed?: boolean
}
// 评论详细信息
export type Comment = {
  id: number
  content: string
  author: Author
  like: number
  time: string
  reply?: Comment[]
  isLike: boolean
  imageUrl?: string // 评论图片URL
}
//帖子详细信息
export type PostDetail = {
  id: number
  imgs: string[]
  title: string
  content: string
  tags: string[]
  author: Author
  like: number
  fav: number
  time: string
  isLike: boolean
  isFav: boolean
  private?: boolean
  comments?: Comment[]

  video?: string // 视频URL
  type?: 'image' | 'video' // 内容类型
  duration?: number // 视频时长
}
