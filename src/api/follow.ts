import request from '@/utils/request'
import { getOssImageUrls } from '@/utils/oss'
import type { FollowUser } from '@/types/index'
import type { FollowListResponse } from '@/types/response'
/**
 * 获取用户的关注列表
 * @param userId 用户ID，不传则获取当前登录用户的关注
 * @param page 页码
 * @param size 每页数量
 * @returns 关注列表数据
 */
export async function getFollowList(
  userId?: number,
  page: number = 1,
  size: number = 10,
): Promise<FollowUser[]> {
  try {
    const res: FollowListResponse = await request.get(
      'http://localhost:8888/userFollows/sb-follows',
      {
        userId,
        page,
        size,
      },
    )
    console.log('获取关注列表响应:', res)
    const list = res.data?.records || []
    // 处理头像URL (批量转换)
    if (list.length > 0) {
      const avatarUrls = list.map((user: FollowUser) => user.avatar).filter(Boolean)
      const convertedAvatarUrls = await getOssImageUrls(avatarUrls)
      let avatarIndex = 0
      list.forEach((user: FollowUser) => {
        if (user.avatar) {
          user.avatar = convertedAvatarUrls[avatarIndex++]
        }
      })
    }
    return list
  } catch (error) {
    console.error('获取关注列表失败:', error)
    return []
  }
}
