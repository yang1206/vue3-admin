import type { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

interface IAxiosResponseData_<T = unknown> {
  code: number
  msg: string
  status: boolean
  data: T
}

interface IAxiosRequestConfig_<D = any> extends AxiosRequestConfig<D> {
  showError?: boolean
  showErrorType?: IAxiosShowErrorType_
  interceptors?: RequestInterceptors<D>
}

interface IAxiosResponse_<T = IAxiosResponseData_, D = any> extends AxiosResponse<T, D> {
  config: InternalAxiosRequestConfig & IAxiosRequestConfig_
}

type IAxiosPromise_<T = IAxiosResponseData_, D = any> = Promise<IAxiosResponse_<T, D>>

interface IAxiosError_<T = IAxiosResponseData_, D = any> extends AxiosError<T, D> {
  response?: IAxiosResponse_<T, D>
}
export interface RequestInterceptors<T> {
  // 请求拦截
  requestInterceptors?: (config: IAxiosRequestConfig_) => IAxiosRequestConfig_
  requestInterceptorsCatch?: (err: IAxiosError_) => IAxiosError_
  // 响应拦截
  responseInterceptors?: (res: IAxiosResponse_<T>) => IAxiosResponse_<T>
  responseInterceptorsCatch?: (err: IAxiosError_) => IAxiosError_
}

// 自定义传入的参数

export interface CancelRequestSource {
  [index: string]: () => void
}

type IAxiosShowErrorType_ = 'dialog' | 'message' | 'notification'

export type {
  IAxiosShowErrorType_ as IAxiosShowErrorType,
  IAxiosResponseData_ as IAxiosResponseData,
  IAxiosRequestConfig_ as IAxiosRequestConfig,
  IAxiosResponse_ as IAxiosResponse,
  IAxiosPromise_ as IAxiosPromise,
  IAxiosError_ as IAxiosError,
}

declare global {
  type IAxiosShowErrorType = IAxiosShowErrorType_
  interface IAxiosResponseData<T = unknown> extends IAxiosResponseData_<T> { }
  interface IAxiosRequestConfig<D = any> extends IAxiosRequestConfig_<D> { }
  interface IAxiosResponse<T = IAxiosResponseData_, D = any> extends IAxiosResponse_<T, D> { }
  type IAxiosPromise<T = IAxiosResponseData_, D = any> = IAxiosPromise_<T, D>
  interface IAxiosError<T = IAxiosResponseData_, D = any> extends IAxiosError_<T, D> { }
}
