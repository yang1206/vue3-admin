import request from '@/service'


export function login() {
  return {
    mutationFn: async (data: any) => (await request.post('/PcLoginMar/pcLogin', data))
  }
}

export function fetchUser(data?: any) {
  return request.post('/PcLoginMar/loginUserInfo', data)
}

export function refreshToken(data?: any) {
  return request.get('/auth/refreshToken', data)
}
