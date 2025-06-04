import request from '@/utils/request'
import type { PostCard } from '@/types'

//关键词搜索帖子
/**
 * @param keyword 搜索关键词
 * @param page 页码
 * @param limit 每页数量
 * @param tag 标签
 * @return PostCard[] 帖子列表
 */
export function fetchPosts(keyword: string): Promise<PostCard[]> {
  return request
    .get('/posts/search', { params: { keyword } })
    .then((res: { data: PostCard[] }) => {
      return res.data
    })
    .catch((err) => {
      console.error('搜索失败', err)
      throw err
    })
}
