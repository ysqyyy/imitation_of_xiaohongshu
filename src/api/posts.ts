import request from '@/utils/request'
import type { PostCard } from '@/types/user'

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
