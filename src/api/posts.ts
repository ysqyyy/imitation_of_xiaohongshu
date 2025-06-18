import request from '@/utils/request'
import type { PostCard, PostDetail } from '@/types'

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
export function fetchRecommendPosts(
  page: number = 1,
  limit: number = 10,
): Promise<RecommendPostsResponse> {
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
          total: data.length,
        }
      }
      // 兜底返回空数据
      return {
        list: [],
        total: 0,
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
 * @param tag 标签（可选）
 * @return Promise<{ list: PostCard[], total: number }> 分页帖子数据
 */
export interface SearchPostsResponse {
  list: PostCard[]
  total: number
}

export function fetchPosts(
  keyword: string,
  page: number = 1,
  limit: number = 9,
  tag?: string,
): Promise<SearchPostsResponse> {
  return request
    .get('http://localhost:8888/posts/search', {
      params: {
        keyword,
        page,
        limit,
        tag,
      },
    })
    .then((res) => {
      console.log('搜索API响应:', res)
      const data = res.data

      // 如果data已经包含list和total，直接返回
      if (data && typeof data === 'object' && 'list' in data && 'total' in data) {
        return data as SearchPostsResponse
      }

      // 如果data是数组（旧格式），包装成新格式
      if (Array.isArray(data)) {
        return {
          list: data,
          total: data.length,
        }
      }

      // 兜底返回空数据
      return {
        list: [],
        total: 0,
      }
    })
    .catch((err) => {
      console.error('搜索失败', err)
      throw err
    })
}

//获取相关视频帖子
/**
 * 获取与指定帖子相关的视频帖子
 * @param postId 帖子ID
 * @param page 页码
 * @param limit 每页数量
 * @return Promise<{ list: PostDetail[], total: number }> 分页视频帖子数据
 */
export interface RelatedVideosResponse {
  list: PostDetail[]
  total: number
}

export function fetchRelatedVideos(
  postId: number,
  page: number = 1,
  limit: number = 5,
): Promise<RelatedVideosResponse> {
  return request
    .get('/posts/related-videos', {
      params: {
        postId,
        page,
        limit,
      },
    })
    .then((res) => {
      console.log('相关视频API响应:', res)
      const data = res.data

      // 如果data已经包含list和total，直接返回
      if (data && typeof data === 'object' && 'list' in data && 'total' in data) {
        return data as RelatedVideosResponse
      }

      // 如果data是数组（旧格式），包装成新格式
      if (Array.isArray(data)) {
        return {
          list: data,
          total: data.length,
        }
      }

      // 兜底返回空数据
      return {
        list: [],
        total: 0,
      }
    })
    .catch((err) => {
      console.error('获取相关视频失败', err)
      throw err
    })
}
