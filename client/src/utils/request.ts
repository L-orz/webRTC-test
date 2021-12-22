import axios from 'axios'
import type { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosInterceptorManager } from 'axios'
import qs from 'qs'

interface XdAxiosInstance extends AxiosInstance {
  <T = any>(config: AxiosRequestConfig): Promise<Api.Response<T>>
  request: <T = any, R = Api.Response<T>>(config: AxiosRequestConfig) => Promise<R>
  get: <T = any, R = Api.Response<T>>(url: string, config?: AxiosRequestConfig) => Promise<R>
  delete: <T = any, R = Api.Response<T>>(url: string, config?: AxiosRequestConfig) => Promise<R>
  head: <T = any, R = Api.Response<T>>(url: string, config?: AxiosRequestConfig) => Promise<R>
  post: <T = any, R = Api.Response<T>>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<R>
  put: <T = any, R = Api.Response<T>>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<R>
  patch: <T = any, R = Api.Response<T>>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<R>
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse<Api.Response>>
  }
}

export const SUCCESS_CODE = 0

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
}) as XdAxiosInstance

axiosInstance.interceptors.response.use(
  (response: AxiosResponse<Api.Response>) => {
    if (response.data?.code === SUCCESS_CODE) {
      return response.data
    } else {
      return Promise.reject(response.data)
    }
  },
  (error) => Promise.reject(error),
)

export const REQUEST = axiosInstance.request
export const GET = axiosInstance.get
export const POST = axiosInstance.post
export const PUT = axiosInstance.put
export const DELETE = axiosInstance.delete
