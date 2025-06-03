/*
 * @Author: 吴伟 15711376175@163.com
 * @Date: 2025-05-30 15:25:08
 * @LastEditors: 吴伟 15711376175@163.com
 * @LastEditTime: 2025-06-03 15:25:09
 * @FilePath: /api_front/src/api/posts.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'
import type { PostCard } from '@/types/user'

// 获取推荐帖子响应类型
export interface RecommendPostsResponse {
  list: PostCard[]
  total: number
}

// 获取推荐帖子
/**
 * @param page 页码
 * @param limit 每页数量
 * @return Promise<{ list: PostCard[], total: number }> 分页帖子数据
 */
export function fetchRecommendPosts(page: number = 1, limit: number = 10): Promise<RecommendPostsResponse> {
  return request
    .get('/posts/recommend', { params: { page, limit } })
    .then((res) => {
      // mock返回的数据结构包含code、data、message等字段
      console.log('API响应:', res)
      const data = res.data
      
      // 如果data已经包含list和total，直接返回
      if (data && typeof data === 'object' && 'list' in data && 'total' in data) {
        return data as RecommendPostsResponse
      }
      // 如果data是数组（旧格式），包装成新格式
      if (Array.isArray(data)) {
        return {
          list: data,
          total: data.length
        }
      }
      // 兜底返回空数据
      return {
        list: [],
        total: 0
      }
    })
    .catch((err) => {
      console.error('获取推荐帖子失败', err)
      throw err
    })
}

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
