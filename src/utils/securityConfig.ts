export interface SecurityConfig {
  // 内容长度限制
  maxTitleLength: number
  maxContentLength: number

  // 文件上传限制
  maxImageSize: number // bytes
  maxVideoSize: number // bytes
  maxImageCount: number
  allowedImageTypes: string[]
  allowedVideoTypes: string[]
}

// 默认安全配置
export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  maxTitleLength: 30,
  maxContentLength: 1000,

  maxImageSize: 10 * 1024 * 1024, // 10MB
  maxVideoSize: 100 * 1024 * 1024, // 100MB
  maxImageCount: 9,
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  allowedVideoTypes: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'],
}

// 获取当前环境的安全配置
export function getSecurityConfig(): SecurityConfig {
  return DEFAULT_SECURITY_CONFIG
}
