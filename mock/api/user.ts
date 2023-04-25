import { resolveToken } from '../utils'

const users = {
  admin: {
    id: 1,
    name: 'Yang1206(admin)',
    avatar: 'https://s2.loli.net/2022/05/12/gxRJwmb1ClQPoGe.jpg',
    creationTime: '2023-04-11T01:28:13.000+0000',
    phone: '13858090645',
    phoneNum: '138****0645',
    regionId: 1,
    isAdmin: 2,
  },
  editor: {
    id: 2,
    name: 'Yang1206(editor)',
    avatar: 'https://s2.loli.net/2022/05/12/gxRJwmb1ClQPoGe.jpg',
    email: 'Ronnie@123.com',
    role: ['editor'],
  },
  guest: {
    id: 1,
    name: 'Yang1206(guest)',
    avatar: 'https://s2.loli.net/2022/05/12/gxRJwmb1ClQPoGe.jpg',
    creationTime: '2023-04-11T01:28:13.000+0000',
    phone: '13858090645',
    phoneNum: '138****0645',
    regionId: 1,
    isAdmin: 0,
  },
}
export default [
  {
    url: '/api/PcLoginMar/loginUserInfo',
    method: 'post',
    response: ({ headers }: MockOption) => {
      const token = resolveToken(headers?.authorization || headers?.token)
      return {
        code: 0,
        data: {
          ...(token ? users.admin : users.guest),
        },
      }
    },
  },
]
