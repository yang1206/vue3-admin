import type { RouteType } from '~/typings/router'

const Layout = () => import('@/layout/index.vue')

export default {
  name: 'Demo',
  path: '/demo',
  component: Layout,
  redirect: '/demo/unocss',
  meta: {
    title: '示例页面',
    customIcon: 'logo',
    role: [0, 1, 2],
    requireAuth: true,
    order: 1,
  },
  children: [
    {
      name: 'Unocss',
      path: 'unocss',
      component: () => import('@/views/demo/unocss/index.vue'),
      meta: {
        title: 'unocss',
        icon: 'logos:unocss',
        role: [0, 1, 2],
        requireAuth: true,
      },
    },
    {
      name: 'Animation',
      path: 'animation',
      component: () => import('@/views/demo/animation/index.vue'),
      meta: {
        title: 'animation',
        icon: 'clarity:animation-line',
        role: [0, 1, 2],
        requireAuth: true,
      },
    },
    {
      name: 'Pro Table',
      path: 'pro-table',
      component: () => import('@/views/demo/pro-table/index.vue'),
      meta: {
        title: 'Pro 表格',
        icon: 'mdi:table',
        role: [0, 1, 2],
        requireAuth: true,
      },
    },
    {
      name: 'DemoTable',
      path: 'table',
      component: () => import('@/views/demo/table/index.vue'),
      meta: {
        title: '表格',
        icon: 'mdi:table',
        role: [0, 1, 2],
        requireAuth: true,
      },
    },
  ],
} as RouteType
