// /utils/request.ts
import axios from 'axios'
import type { AxiosRequestConfig, AxiosInstance } from 'axios'
import auth from '@/utils/auth'

// 定义通用响应体结构 - 修改为匹配后端的字段名
export interface Result<T = unknown> {
  code: number
  msg: string // 改为 msg，匹配后端
  data: T
}

// 创建axios实例
const instance: AxiosInstance = axios.create({
  baseURL: '/api', // 你的后端接口基础地址
  timeout: 10000,
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 获取token并添加到请求头中
    const token = auth.getToken()
    // console.log(`当前请求的token: ${token}`)
    if (token && config.headers) {
      config.headers['Content-Type'] = 'application/json'
      config.headers['Authorization'] = `Bearer ${token}`
    }
    // console.log(`请求配置: ${JSON.stringify(config, null, 2)}`)
    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截器 - 不自动解析data，让调用者决定如何处理
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error(`请求异常: ${error}`)
    return Promise.reject(error)
  },
)

// 封装请求方法
const request = {
  // GET请求
  get<T = unknown>(url: string, params?: unknown, config?: AxiosRequestConfig): Promise<Result<T>> {
    return instance.get(url, { params, ...config }).then((res) => res.data)
  },

  // POST请求
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<Result<T>> {
    return instance.post(url, data, config).then((res) => res.data)
  },

  // PUT请求
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<Result<T>> {
    return instance.put(url, data, config).then((res) => res.data)
  },

  // DELETE请求
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<Result<T>> {
    return instance.delete(url, config).then((res) => res.data)
  },
}

export default request
