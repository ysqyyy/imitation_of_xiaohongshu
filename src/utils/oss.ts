import OSS from 'ali-oss'

// ⚠️ 警告：此方案仅用于本地测试，切勿用于生产环境！
const OSS_CONFIG = {
  region: 'oss-cn-beijing', // 替换为你的OSS区域
  accessKeyId: 'LTAI5tLyzp6Brn4WSs6fnp8f', // 替换为你的AccessKey ID
  accessKeySecret: 'LSwSd9Tl00L6R5ewxfg8AuPlDhbIV9', // 替换为你的AccessKey Secret
  bucket: 'rednote-store', // 替换为你的存储桶名称
}
// aliyun.oss.endpoint=https://oss-cn-beijing.aliyuncs.com
// aliyun.oss.access-key-id=LTAI5tLyzp6Brn4WSs6fnp8f
// aliyun.oss.access-key-secret=LSwSd9Tl00L6R5ewxfg8AuPlDhbIV9
// aliyun.oss.bucket-name=rednote-store
let ossClient = null

export function initOssClient() {
  if (!ossClient) {
    ossClient = new OSS(OSS_CONFIG)
  }
  return ossClient
}

export async function getOssImageUrl(objectKey: string, expires = 3600) {
  try {
    // 使用批量获取函数，但只传入一个URL
    const urls = await getOssImageUrls([objectKey], expires)
    return urls[0] // 返回数组中的第一个URL
  } catch (error) {
    console.error('获取OSS图片URL失败:', error)
    throw error
  }
}

/**
 * 获取 OSS 视频 URL
 * @param objectKey 视频对象键
 * @param expires URL 过期时间（秒）
 * @returns 签名的视频 URL
 */
export async function getOssVideoUrl(objectKey: string, expires = 3600) {
  try {
    // 使用批量获取函数，但只传入一个URL
    const urls = await getOssVideoUrls([objectKey], expires)
    console.log('获取OSS视频URL:', urls[0])
    return urls[0] // 返回数组中的第一个URL
  } catch (error) {
    console.error('获取OSS视频URL失败:', error)
    throw error
  }
}

/**
 * 批量获取OSS图片URL
 * @param objectKeys 图片对象键数组
 * @param expires URL过期时间（秒）
 * @returns 签名的图片URL数组
 */
export async function getOssImageUrls(objectKeys: string[], expires = 3600) {
  try {
    const client = initOssClient()

    // 使用Promise.all并行处理所有URL请求
    const urls = await Promise.all(
      objectKeys.map((objectKey) =>
        client.signatureUrl(objectKey, {
          expires, // 1小时有效期
          method: 'GET',
          // 添加 response 参数，设置 Content-Disposition 为 inline
          // 这会告诉浏览器直接在页面中显示图片，而不是下载它
          response: {
            'content-disposition': 'inline',
          },
        }),
      ),
    )

    return urls
  } catch (error) {
    console.error('批量获取OSS图片URL失败:', error)
    throw error
  }
}

/**
 * 批量获取 OSS 视频 URL
 * @param objectKeys 视频对象键数组
 * @param expires URL 过期时间（秒）
 * @returns 签名的视频 URL 数组
 */
export async function getOssVideoUrls(objectKeys: string[], expires = 3600) {
  try {
    const client = initOssClient()

    // 使用Promise.all并行处理所有URL请求
    const urls = await Promise.all(
      objectKeys.map((objectKey) =>
        client.signatureUrl(objectKey, {
          expires, // 1小时有效期
          method: 'GET',
          // 视频文件也设置为 inline 显示
          response: {
            'content-disposition': 'inline',
          },
        }),
      ),
    )

    return urls
  } catch (error) {
    console.error('批量获取OSS视频URL失败:', error)
    throw error
  }
}
