import request from '@/utils/request'
import type { PostCard, PostDetail } from '@/types'
import { getOssImageUrls } from '@/utils/oss'
// 获取推荐帖子响应类型
export interface RecommendPostsResponse {
  list: PostCard[]
  total: number
}

// 获取推荐帖子  ok
export async function fetchRecommendPosts(
  page: number = 1,
  limit: number = 10,
): Promise<RecommendPostsResponse> {
  try {
    const res = await request.get('http://localhost:8888/posts/recommend', { page, limit })
    console.log('推荐API响应:', res)
    // 使用类型断言
    const data = (res.data || []) as PostCard[]

    // 收集所有需要转换的图片URL
    const postImgUrls = data.map((item) => item.img).filter(Boolean)
    const authorImgUrls = data
      .filter((item) => item.author && item.author.img)
      .map((item) => item.author.img)
    const [convertedPostImgUrls, convertedAuthorImgUrls] = await Promise.all([
      getOssImageUrls(postImgUrls),
      getOssImageUrls(authorImgUrls),
    ])
    let postImgIndex = 0
    data.forEach((item) => {
      if (item.img) {
        item.img = convertedPostImgUrls[postImgIndex++]
      }
    })
    let authorImgIndex = 0
    data.forEach((item) => {
      if (item.author && item.author.img) {
        item.author.img = convertedAuthorImgUrls[authorImgIndex++]
      }
    })
    console.log('转换后的帖子数据:', data)
    return {
      list: data,
      total: data.length, // 假设返回的data是一个数组，total就是数组长度
    }
  } catch (error) {
    console.error('获取推荐帖子失败:', error)
    throw error
  }
}

//关键词搜索帖子  ok
/**
 * @param keyword 搜索关键词
 * @param page 页码
 * @param limit 每页数量
 * @param tag 标签（可选）
 * @return Promise<PostCard[]> 分页帖子数据
 */
export function fetchPosts(
  keyword: string,
  page: number = 1,
  limit: number = 9,
  tag?: string,
): Promise<PostCard[]> {
  return request
    .get('http://localhost:8888/posts/search', {
      keyword,
      page,
      limit,
      tag,
    })
    .then(async (res) => {
      console.log('搜索API响应:', res)
      // 使用Record类型代替any
      const responseData = res.data as Record<string, unknown>
      const data = (responseData.records || []) as PostCard[]

      // 收集所有需要转换的图片URL
      const postImgUrls = data.map((item) => item.img).filter(Boolean)
      const authorImgUrls = data
        .filter((item) => item.author && item.author.img)
        .map((item) => item.author.img)
      const [convertedPostImgUrls, convertedAuthorImgUrls] = await Promise.all([
        getOssImageUrls(postImgUrls),
        getOssImageUrls(authorImgUrls),
      ])
      let postImgIndex = 0
      data.forEach((item) => {
        if (item.img) {
          item.img = convertedPostImgUrls[postImgIndex++]
        }
      })
      let authorImgIndex = 0
      data.forEach((item) => {
        if (item.author && item.author.img) {
          item.author.img = convertedAuthorImgUrls[authorImgIndex++]
        }
      })
      console.log('转换后的帖子数据:', data)
      if (Array.isArray(data)) return data
      return []
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
  code: number
  msg: string
  data: {
    records: number[]
    total: number
    size: number
    current: number
    pages: number
  }
}

export function fetchRelatedVideos(postId: number, page: number): Promise<number[]> {
  return request
    .get('http://localhost:8888/posts/recommendNext', {
      postId,
      page,
    })
    .then((res) => {
      console.log('相关视频API响应:', res)
      const data = res.data.records
      return data
    })
    .catch((err) => {
      console.error('获取相关视频失败', err)
      throw err
    })
}
// 获取用户个性化推荐帖子（需要登录）
/**
 * @param page 页码
 * @param limit 每页数量
 * @return Promise<{ list: PostCard[], total: number }> 分页帖子数据
 */
export async function fetchMyRecommendPosts(
  page: number = 1,
  limit: number = 10,
): Promise<RecommendPostsResponse> {
  try {
    const res = await request.get('http://localhost:8888/posts/myRecommend', { page, limit })
    console.log('个性化推荐API响应:', res)
    const data = res.data.records || res.data // 根据API文档，数据在records字段中

    // 转换OSS图片地址
    await Promise.all(
      data.map(async (item: any) => {
        item.img = await getOssImageUrl(item.img)
      }),
    )

    // 转换作者头像OSS地址
    await Promise.all(
      data.map(async (item: any) => {
        if (item.author && item.author.img) {
          item.author.img = await getOssImageUrl(item.author.img)
        } else {
          console.warn('帖子作者信息不完整:', item.author)
        }
      }),
    )

    console.log('转换后的个性化推荐帖子数据:', data)

    return {
      list: data,
      total: res.data.total || data.length,
    }
  } catch (error) {
    console.error('获取个性化推荐帖子失败:', error)
    throw error
  }
}
