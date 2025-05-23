// 帖子缩略图
export type PostCard = {
  id: number
  img: string
  title: string
  author: Author
  like: number
  private?: boolean
  tabs?: string[]
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
  likedPosts: PostCard[]
  favPosts: PostCard[]
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
}
//帖子详细信息
export type PostDetail = {
  id: number
  imgs: string[]
  title: string
  content: string
  tabs: string[]
  author: Author
  like: number
  fav: number
  time: string
  isLike: boolean
  isFav: boolean
  private?: boolean
  comments?: Comment[]
}
