import request from '@/utils/request'
import router from '@/router'
import type { PostDetail } from '@/types/index'
import auth from '@/utils/auth'
import type {
  SuccessResponse,
  CommentResponse,
  LikeResponse,
  FavoriteResponse,
  PublishResponse,
} from '@/types/api'
import axios from 'axios'
import { getOssImageUrl, getOssVideoUrl, getOssImageUrls } from '@/utils/oss'
// 发布帖子 ok
export async function publishPost(formData: FormData): Promise<PublishResponse | null> {
  try {
    const res = await axios.post('http://localhost:8888/posts/publish', formData, {
      headers: {
        Authorization: `Bearer ${auth.getToken()}`,
        'Content-Type': 'multipart/form-data', // 设置为 multipart/form-data
      },
    })
    console.log('发布帖子请求:', res)
    if (res.data && res.data.code === 200) {
      return res.data
    }
    return null
  } catch (error) {
    console.error('发布帖子失败:', error)
    return null
  }
}

/**
 * 编辑帖子   ok
 */
export async function editPost(id: number, formData: FormData): Promise<SuccessResponse | null> {
  try {
    // 使用 axios 直接发送 FormData
    const res = await axios.put(`http://localhost:8888/posts/update/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${auth.getToken()}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    console.log('编辑帖子请求:', res)
    if (res.data && res.data.code === 200) {
      return res.data
    }
    return null
  } catch (error) {
    console.error('编辑帖子失败:', error)
    return null
  }
}
//通过ID获取帖子详情  ok ossok
export async function getPostById(id: number): Promise<PostDetail | null> {
  try {
    const res = await request.get<PostDetail>(`http://localhost:8888/posts/detail?id=${id}`)
    console.log('获取帖子详情请求:', res)
    // const res = await request.get<PostDetail>(`/detail/${id}`)

    // 收集所有需要转换的图片和视频URL
    let imgUrls: string[] = []
    let videoUrl: string | null = null
    let authorImgUrl: string | null = null
    const commentAuthorImgUrls: string[] = []
    const replyAuthorImgUrls: string[] = []
    const commentImgUrls: string[] = [] // 评论图片URL
    const replyImgUrls: string[] = [] // 回复图片URL

    // 收集帖子图片URL
    if (res.data.imgs && res.data.imgs.length > 0) {
      imgUrls = res.data.imgs.filter(Boolean)
    }

    // 收集视频URL
    if (res.data.video) {
      videoUrl = res.data.video
    }

    // 收集作者头像URL
    if (res.data.author && res.data.author.img) {
      authorImgUrl = res.data.author.img
    }

    // 收集评论和回复中的作者头像URL
    if (res.data.comments && res.data.comments.length > 0) {
      res.data.comments.forEach((comment) => {
        if (comment.author && comment.author.img) {
          commentAuthorImgUrls.push(comment.author.img)
        }

        // 收集评论图片URL
        if (comment.imageUrl) {
          commentImgUrls.push(comment.imageUrl.slice(2, comment.imageUrl.length - 2))
        }

        // 收集二级评论(回复)的作者头像
        if (comment.reply && comment.reply.length > 0) {
          comment.reply.forEach((reply) => {
            if (reply.author && reply.author.img) {
              replyAuthorImgUrls.push(reply.author.img)
            }

            // 收集回复图片URL
            if (reply.imageUrl) {
              replyImgUrls.push(reply.imageUrl.slice(2, reply.imageUrl.length - 2))
            }
          })
        }
      })
    }

    // 批量转换URL
    const [
      convertedImgUrls,
      convertedVideoUrl,
      convertedAuthorImgUrl,
      convertedCommentAuthorImgs,
      convertedReplyAuthorImgs,
      convertedCommentImgUrls,
      convertedReplyImgUrls,
    ] = await Promise.all([
      imgUrls.length > 0 ? getOssImageUrls(imgUrls) : [],
      videoUrl ? getOssVideoUrl(videoUrl) : null,
      authorImgUrl ? getOssImageUrl(authorImgUrl) : null,
      commentAuthorImgUrls.length > 0 ? getOssImageUrls(commentAuthorImgUrls) : [],
      replyAuthorImgUrls.length > 0 ? getOssImageUrls(replyAuthorImgUrls) : [],
      commentImgUrls.length > 0 ? getOssImageUrls(commentImgUrls) : [],
      replyImgUrls.length > 0 ? getOssImageUrls(replyImgUrls) : [],
    ])

    // 更新帖子图片
    if (res.data.imgs && res.data.imgs.length > 0) {
      res.data.imgs = convertedImgUrls
    }

    // 更新视频URL
    if (res.data.video) {
      res.data.video = convertedVideoUrl
    }

    // 更新作者头像
    if (res.data.author && res.data.author.img) {
      res.data.author.img = convertedAuthorImgUrl
    }

    // 更新评论和回复中的作者头像
    if (res.data.comments && res.data.comments.length > 0) {
      let commentImgIndex = 0
      let replyImgIndex = 0
      let commentImgUrlIndex = 0
      let replyImgUrlIndex = 0

      res.data.comments.forEach((comment) => {
        if (comment.author && comment.author.img) {
          comment.author.img = convertedCommentAuthorImgs[commentImgIndex++]
        }

        // 更新评论图片URL
        if (comment.imageUrl) {
          comment.imageUrl = convertedCommentImgUrls[commentImgUrlIndex++]
        }

        // 更新二级评论(回复)的作者头像
        if (comment.reply && comment.reply.length > 0) {
          comment.reply.forEach((reply) => {
            if (reply.author && reply.author.img) {
              reply.author.img = convertedReplyAuthorImgs[replyImgIndex++]
            }

            // 更新回复图片URL
            if (reply.imageUrl) {
              reply.imageUrl = convertedReplyImgUrls[replyImgUrlIndex++]
            }
          })
        }
      })
    }

    if (res.code === 200) {
      console.log('处理后的帖子详情:', res.data)
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
  contentData: FormData,
  type: string,
): Promise<CommentResponse | null> {
  try {
    console.log('发送评论请求类型:', type)
    console.log('发送评论内容:', contentData)

    // 如果是FormData，打印其中的内容
    if (contentData instanceof FormData) {
      console.log('FormData内容:')
      for (const pair of contentData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`)
      }
    }

    if (type === 'post') {
      const res = await axios.post<CommentResponse>(
        `http://localhost:8888/posts/comments`,
        contentData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${auth.getToken()}`,
          },
        },
      )
      console.log('发送带图片的帖子评论请求:', res)
      return res.data
    } else if (type === 'comment') {
      const res = await axios.post<CommentResponse>(
        `http://localhost:8888/comments/comments`,
        contentData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${auth.getToken()}`,
          },
        },
      )
      console.log('发送带图片的评论回复请求:', res)
      return res.data
    }
    return null
  } catch (error) {
    console.error('发送评论失败:', error)
    return null
  }
}

//删除帖子 ok
export async function deletePost(id: number): Promise<SuccessResponse | null> {
  try {
    const res = await request.delete<SuccessResponse>(`http://localhost:8888/posts/delete/${id}`)
    console.log('删除帖子请求:', res)
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
