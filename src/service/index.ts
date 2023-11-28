import qs from 'qs'
import type { VueQueryPluginOptions } from '@tanstack/vue-query'
import Request from './request'
import { showRequestError } from './request/helpers'
import { DefaultBaseUrl, DefaultHeaders } from '@/constants'
import { getToken } from '@/utils'

const request = new Request({
  baseURL: DefaultBaseUrl,
  timeout: 1000 * 60 * 4,
  withCredentials: false,
  paramsSerializer: (params: any) => {
    const query = qs.stringify(
      Object.fromEntries(
        Object.entries(params).filter(
          ([, v]) => !['undefined', 'null', undefined, null].includes((v as any)?.toString() ?? v),
        ),
      ),
    )

    return query
  },
  interceptors: {
    // 请求拦截器
    requestInterceptors: (config: IAxiosRequestConfig) => {
      const token = getToken()
      if (!token) {
        // TODO
      }

      else {
        const Authorization = config.headers?.Authorization || `${token}`
        if (config.headers) {
          config.headers.Authorization = config.headers.Authorization || `${token}`
          config.headers.token = config.headers.Authorization || `${token}`
        }
        else { config.headers = { Authorization } }
      }

      config.headers = {
        ...DefaultHeaders,
        ...config.headers,
      }
      return config
    },
    // 响应拦截器
    responseInterceptors: (result: IAxiosResponse) => {
      if (!(result?.data?.code === 0)) {
        if (result?.config?.showError ?? true) {
          showRequestError({
            response: result,
            error: result?.data as unknown as IAxiosError,
            type: result.config?.showErrorType,
          })
        }
      }
      return result
    },
  },
})

export default request

export const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  },
}
