import request from '@/utils/request'
import router from '@/router'
import type { PostDetail } from '@/types/user'

//点开帖子详情
export function goDetail(id: number) {
  router.push({
    path: router.currentRoute.value.path,
    query: {
      ...router.currentRoute.value.query,
      detail: id,
    },
  })
}

// 关闭弹窗时移除 detail 参数
export function closeDetail() {
  const query = { ...router.currentRoute.value.query }
  delete query.detail
  router.replace({
    path: router.currentRoute.value.path,
    query,
  })
}
/**
 * 通过ID获取帖子详情
 * @param id 帖子ID
 * @returns Promise<Post | null> 返回帖子详情或null
 */
export async function getPostById(id: number): Promise<PostDetail | null> {
  try {
    const res = await request.get(`/detail/${id}`)
    return res.data
  } catch (error) {
    console.error('获取帖子详情失败:', error)
    return null
  }
}

//**发送评论 （帖子/评论）*/
export async function sendComment(id: number, content: string, type: string) {
  let res
  try {
    if (type === 'post') {
      res = await request.post(`/posts/${id}/comments`, { content })
    } else if (type === 'comment') {
      res = await request.post(`/comments/${id}/comments`, { content })
    }
  } catch (error) {
    console.error('Error sending comment:', error)
  }
  return res
}

/**
 * 点赞帖子
 * @param id 帖子ID
 * @returns Promise 返回点赞结果
 */
export async function likePost(id: number) {
  try {
    const res = await request.post('/detail/like', { id })
    return res.data
  } catch (error) {
    console.error('点赞失败:', error)
    return null
  }
}

/**
 * 收藏帖子
 * @param id 帖子ID
 * @returns Promise 返回收藏结果
 */
export async function favoritePost(id: number) {
  try {
    const res = await request.post('/detail/fav', { id })
    return res.data
  } catch (error) {
    console.error('收藏失败:', error)
    return null
  }
}
