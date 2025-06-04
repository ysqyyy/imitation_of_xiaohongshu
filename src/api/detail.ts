import request from '@/utils/request'
import router from '@/router'
import type { PostDetail } from '@/types/index'

// 发布帖子
export async function publishPost(postData: {
  title: string
  content: string
  tags: string[]
  imgs: string[]
  private: boolean
}) {
  return request({
    url: '/api/post/publish',
    method: 'post',
    data: postData,
  })
}

//点开帖子
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

/** 通过ID获取帖子详情
 * @param id 帖子ID
 * @return PostDetail 帖子详情
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

//**发送评论 （帖子/评论）
/**
 * @param id 帖子ID或评论ID
 * @param content 评论内容
 * @return 成功或失败信息
 */
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

/** 点赞帖子
 * @param id 帖子ID
 * @return 成功或失败信息
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

/**收藏帖子
 ** @param id 帖子ID
 * @return 成功或失败信息
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
) {
  try {
    const res = await request({
      url: `/api/post/edit/${id}`,
      method: 'put',
      data: postData,
    })
    return res.data
  } catch (error) {
    console.error('编辑帖子失败:', error)
    return null
  }
}

/**
 * 删除帖子
 * @param id 帖子ID
 * @return 成功或失败信息
 */
export async function deletePost(id: number) {
  try {
    const res = await request({
      url: `/api/post/delete/${id}`,
      method: 'delete',
    })
    return res.data
  } catch (error) {
    console.error('删除帖子失败:', error)
    return null
  }
}
