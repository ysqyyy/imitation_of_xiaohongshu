const SENSITIVE_WORDS = [
  '政治敏感词1',
  '政治敏感词2',
  '色情',
  '性暗示',
  '暴力',
  '血腥',
  '杀害',
  '种族歧视',
  '性别歧视',
  '欺诈',
  '诈骗',
  '恶意链接',
]

// XSS 攻击
const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
  /<link\b[^<]*(?:(?!<\/link>)<[^<]*)*>/gi,
  /<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*>/gi,
]

// SQL 注入
const SQL_INJECTION_PATTERNS = [
  /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/gi,
  /(--|#|\/\*|\*\/)/g,
  /('|"|;|\||&)/g,
]

// 垃圾邮件
const SPAM_PATTERNS = [
  /(\w+\.){2,}\w+/g, // 多级域名
  /(微信|QQ|电话|手机).*?[\d\-+()s]{7,}/g, // 联系方式
  /(加我|联系我|私聊|代购|兼职|赚钱)/g, // 垃圾信息关键词
  /[\u4e00-\u9fff]{50,}/g, // 过长的中文字符（可能是垃圾信息）
]

export interface ContentCheckResult {
  isValid: boolean
  errorMessage?: string
}

/**
 * 检查文本内容是否安全
 * @param content 要检查的内容
 * @param maxLength 最大长度限制
 * @returns 检查结果
 */
export function checkContentSafety(content: string, maxLength: number = 1000): ContentCheckResult {
  // 1. 检查是否为空
  if (!content || content.trim().length === 0) {
    return {
      isValid: false,
      errorMessage: '内容不能为空',
    }
  }

  // 2. 检查长度
  if (content.length > maxLength) {
    return {
      isValid: false,
      errorMessage: `内容长度不能超过${maxLength}个字符`,
    }
  }

  // 3. 检查敏感词
  const sensitiveWordCheck = checkSensitiveWords(content)
  if (!sensitiveWordCheck.isValid) {
    return sensitiveWordCheck
  }

  // 4. 检查XSS攻击
  const xssCheck = checkXSS(content)
  if (!xssCheck.isValid) {
    return xssCheck
  }

  // 5. 检查SQL注入
  const sqlCheck = checkSQLInjection(content)
  if (!sqlCheck.isValid) {
    return sqlCheck
  }

  // 6. 检查垃圾信息
  const spamCheck = checkSpam(content)
  if (!spamCheck.isValid) {
    return spamCheck
  }

  return { isValid: true }
}

/**
 * 检查敏感词
 */
function checkSensitiveWords(content: string): ContentCheckResult {
  const foundWords: string[] = []

  for (const word of SENSITIVE_WORDS) {
    if (content.toLowerCase().includes(word.toLowerCase())) {
      foundWords.push(word)
    }
  }

  if (foundWords.length > 0) {
    return {
      isValid: false,
      errorMessage: '内容包含敏感词汇，请修改后重试',
    }
  }

  return { isValid: true }
}

/**
 * 检查XSS攻击
 */
function checkXSS(content: string): ContentCheckResult {
  for (const pattern of XSS_PATTERNS) {
    if (pattern.test(content)) {
      return {
        isValid: false,
        errorMessage: '内容包含潜在的安全风险，请删除脚本代码',
      }
    }
  }

  return { isValid: true }
}

/**
 * 检查SQL注入
 */
function checkSQLInjection(content: string): ContentCheckResult {
  for (const pattern of SQL_INJECTION_PATTERNS) {
    if (pattern.test(content)) {
      return {
        isValid: false,
        errorMessage: '内容包含非法字符，请修改后重试',
      }
    }
  }

  return { isValid: true }
}

/**
 * 检查垃圾信息
 */
function checkSpam(content: string): ContentCheckResult {
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(content)) {
      return {
        isValid: false,
        errorMessage: '内容可能包含广告或垃圾信息，请修改后重试',
      }
    }
  }

  return { isValid: true }
}

/**
 * 转义特殊字符
 * @param input 输入字符串
 * @returns 转义后的字符串
 */
export function escapeHTML(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}
