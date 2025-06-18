import request from '@/utils/request'
import router from '@/router'
import type { PostDetail } from '@/types/index'
import type {
  SuccessResponse,
  CommentResponse,
  LikeResponse,
  FavoriteResponse,
  PublishResponse,
} from '@/types/api'

// 发布帖子
export async function publishPost(postData: {
  title: string
  content: string
  tags?: string[]
  imgs?: string[]
  vieo?: string // 可选的视频URL
  type?: 'image' | 'video' // 可选的内容类型
  duration?: number // 可选的视频时长（秒）
}): Promise<PublishResponse | null> {
  try {
    const res = await request.post<PublishResponse>('/post/publish', postData)
    if (res.code === 200) {
      return res.data
    }
    return null
  } catch (error) {
    console.error('发布帖子失败:', error)
    return null
  }
}

//通过ID获取帖子详情  ok
export async function getPostById(id: number): Promise<PostDetail | null> {
  try {
    const res = await request.get<PostDetail>(`http://localhost:8888/posts/detail?id=${id}`)
    console.log('获取帖子详情请求:', res)
    // const res = await request.get<PostDetail>(`/detail/${id}`)
    if (res.code === 200) {
      console.log('获取帖子详情成功:', res.data)
      return res.data
    }
    return null
  } catch (error) {
    console.error('获取帖子详情失败:', error)
    return null
  }
}

//发送评论 （帖子/评论）  ok
export async function sendComment(
  id: number,
  content: string,
  type: string,
): Promise<CommentResponse | null> {
  try {
    if (type === 'post') {
      const res = await request.post<CommentResponse>(
        `http://localhost:8888/posts/${id}/comments?content=${content}`,
      )
      console.log('发送帖子评论请求:', res)
      if (res.code === 200) {
        return res.data
      }
    } else if (type === 'comment') {
      const res = await request.post<CommentResponse>(
        `http://localhost:8888/comments/${id}/comments?content=${content}`,
      )
      console.log('发送评论评论请求:', res)
      if (res.code === 200) {
        return res.data
      }
    }
    return null
  } catch (error) {
    console.error('发送评论失败:', error)
    return null
  }
}

/**
 * 编辑帖子
 * @param id 帖子ID
 * @param postData 帖子数据
 * @return 成功或失败信息
 */
export async function editPost(
  id: number,
  postData: {
    title: string
    content: string
    tags: string[]
    imgs: string[]
    private: boolean
  },
): Promise<SuccessResponse | null> {
  try {
    const res = await request.put<SuccessResponse>(`/post/edit/${id}`, postData)
    if (res.code === 200) {
      return res.data
    }
    return null
  } catch (error) {
    console.error('编辑帖子失败:', error)
    return null
  }
}

//删除帖子
export async function deletePost(id: number): Promise<SuccessResponse | null> {
  try {
    const res = await request.delete<SuccessResponse>(`/post/delete/${id}`)
    if (res.code === 200) {
      return res.data
    }
    return null
  } catch (error) {
    console.error('删除帖子失败:', error)
    return null
  }
}

//收藏帖子 ok
export async function favoritePost(id: number): Promise<FavoriteResponse | null> {
  try {
    console.log('收藏帖子请求ID:', id)
    const res = await request.post<FavoriteResponse>(
      `http://localhost:8888/userCollects/posts?id=${id}`,
    )
    console.log('收藏帖子请求:', res)
    if (res.code === 200) {
      return res.data
    }
    return null
  } catch (error) {
    console.error('收藏失败:', error)
    return null
  }
}

// 取消收藏帖子 ok
export async function unfavoritePost(id: number): Promise<FavoriteResponse | null> {
  try {
    console.log('取消收藏帖子请求ID:', id)
    const res = await request.delete<FavoriteResponse>(
      `http://localhost:8888/userCollects/posts?id=${id}`,
    )
    console.log('取消收藏帖子请求:', res)
    if (res.code === 200) {
      return res.data
    }
    return null
  } catch (error) {
    console.error('取消收藏失败:', error)
    return null
  }
}

// 点赞帖子  ok
export async function likePost(id: number): Promise<LikeResponse | null> {
  try {
    const res = await request.post<LikeResponse>(`http://localhost:8888/userLikes/posts/${id}`)
    console.log('点赞帖子请求:', res)
    if (res.code === 200) {
      return res.data
    }
    return null
  } catch (error) {
    console.error('点赞失败:', error)
    return null
  }
}
// 取消点赞帖子  ok
export async function unlikePost(id: number): Promise<LikeResponse | null> {
  try {
    const res = await request.delete<LikeResponse>(`http://localhost:8888/userLikes/posts/${id}`)
    console.log('取消点赞帖子请求:', res)
    if (res.code === 200) {
      return res.data
    }
    return null
  } catch (error) {
    console.error('取消点赞失败:', error)
    return null
  }
}

// 点赞评论  ok
export async function likeComment(id: number): Promise<LikeResponse | null> {
  try {
    const res = await request.post<LikeResponse>(`http://localhost:8888/userLikes/comments/${id}`)
    if (res.code === 200) {
      console.log('点赞评论请求:', res)

      return res.data
    }
    return null
  } catch (error) {
    console.error('评论点赞失败:', error)
    return null
  }
}
//取消点赞评论  ok
export async function unlikeComment(id: number): Promise<LikeResponse | null> {
  try {
    const res = await request.delete<LikeResponse>(`http://localhost:8888/userLikes/comments/${id}`)
    if (res.code === 200) {
      console.log('取消点赞pinglun请求:', res)

      return res.data
    }
    return null
  } catch (error) {
    console.error('取消评论点赞失败:', error)
    return null
  }
}

// 删除评论  ok
export async function deleteComment(id: number): Promise<SuccessResponse | null> {
  try {
    console.log('删除评论请求ID:', id)
    const res = await request.delete<SuccessResponse>(
      `http://localhost:8888/comments/${id}/comments`,
    )
    console.log('删除评论请求响应:', res)
    if (res.code === 200) {
      return res.data
    }
    return null
  } catch (error) {
    console.error('删除评论失败:', error)
    return null
  }
}

//点开帖子 ok
export function goDetail(id: number) {
  router.push({
    path: router.currentRoute.value.path,
    query: {
      ...router.currentRoute.value.query,
      detail: id,
    },
  })
}

// 关闭弹窗时移除 detail 参数 ok
export function closeDetail() {
  const query = { ...router.currentRoute.value.query }
  delete query.detail
  router.replace({
    path: router.currentRoute.value.path,
    query,
  })
}
