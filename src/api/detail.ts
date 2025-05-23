import request from '@/utils/request'
import router from '@/router'
import type { PostCard, PostDetail } from '@/types/user'

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
    // 直接使用新添加的 /posts/:id 接口
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
