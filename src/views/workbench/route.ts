import type { RouteType } from '~/typings/router'

const Layout = () => import('@/layout/index.vue')

export default {
  name: 'Dashboard',
  path: '/',
  component: Layout,
  redirect: '/workbench',
  meta: {
    order: 0,
    isCollapseSingleMenu: true,
  },
  children: [
    {
      name: 'Workbench',
      path: 'workbench',
      component: () => import('./index.vue'),
      meta: {
        title: '工作台',
        icon: 'mdi:home',
        keepAlive: true,
      },
    },
  ],
} as RouteType
