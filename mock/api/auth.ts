import { resolveToken } from '../utils'

const token = {
  admin: 'admin',
  editor: 'editor',
  phone: 'dchsdbchdfbcghdbghcdfbghb',
}

export default [
  {
    url: '/api/PcLoginMar/pcLogin',
    method: 'post',
    response: (options: MockOption) => {
      const { phone } = options.body
      if (['admin', 'editor', '13858090645'].includes(phone)) {
        return {
          msg: '操作成功',
          code: 0,
          data: {
            token: 'jhsahjdnhsanh',
          },
        }
      }
      else {
        return {
          code: -1,
          message: '没有此用户',
        }
      }
    },
  },
  {
    url: '/api/auth/refreshToken',
    method: 'post',
    response: ({ headers }: MockOption) => {
      return {
        code: 0,
        data: {
          token: resolveToken(headers?.authorization),
        },
      }
    },
  },
]
