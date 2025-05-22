import axios from 'axios'

const service = axios.create({
  baseURL: '/api', // 你的后端接口基础地址
  timeout: 10000,
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 可在此处添加token等
    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => Promise.reject(error),
)

export default service
