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
    const client = initOssClient()
    const url = client.signatureUrl(objectKey, {
      expires, // 1小时有效期
      method: 'GET',
      // 添加 response 参数，设置 Content-Disposition 为 inline
      // 这会告诉浏览器直接在页面中显示图片，而不是下载它
      response: {
        'content-disposition': 'inline',
        // 你可以根据实际图片类型设置 content-type
        // 'content-type': 'image/png',
      },
    })
    // console.log('获取OSS图片URL:', url)
    return url
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
    const client = initOssClient()
    // console.log('获取OSS视频URL:', objectKey)
    const url = client.signatureUrl(objectKey, {
      expires, // 1小时有效期
      method: 'GET',
      // 视频文件也设置为 inline 显示
      response: {
        'content-disposition': 'inline',
        // 'content-type': 'video/mp4', // 确保浏览器将内容识别为视频
      },
    })
    console.log('获取OSS视频URL:', url)
    return url
  } catch (error) {
    console.error('获取OSS视频URL失败:', error)
    throw error
  }
}
