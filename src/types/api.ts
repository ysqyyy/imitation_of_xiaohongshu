// API 响应类型定义

// 通用的成功响应类型
export interface SuccessResponse {
  success: boolean
  message?: string
}

// 评论响应类型
export interface CommentResponse extends SuccessResponse {
  commentId?: number
}

// 点赞响应类型
export interface LikeResponse extends SuccessResponse {
  isLike: boolean
  like: number
}

// 收藏响应类型
export interface FavoriteResponse extends SuccessResponse {
  isFav: boolean
}

// 发布帖子响应类型
export interface PublishResponse extends SuccessResponse {
  postId: number
}
