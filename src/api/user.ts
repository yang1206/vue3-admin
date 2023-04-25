import request from '@/service'

export function login(data?: any) {
  return request<unknown, any>({
    url: '/PcLoginMar/pcLogin',
    method: 'POST',
    data,
  })
}

export function getUser(data?: any) {
  return request<unknown, any>({
    url: '/PcLoginMar/loginUserInfo',
    method: 'POST',
    data,
  })
}

export function refreshToken(data?: any) {
  return request<unknown, any>({
    url: '/auth/refreshToken',
    method: 'GET',
    data,
  })
}
