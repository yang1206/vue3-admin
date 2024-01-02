import type { Role } from '@/store'
import type { RouteType, RoutesType } from '~/typings/router'

function hasPermission(route: RouteType, role: Role) {
  // * 不需要权限直接返回true
  if (!route.meta?.requireAuth)
    return true

  const routeRole = route.meta?.role ? route.meta.role : []

  // * 登录用户没有角色或者路由没有设置角色判定为没有权限
  if (role || !routeRole.length)
    return false

  // * 路由指定的角色包含任一登录用户角色则判定有权限
  return routeRole.includes(role)
}

export function filterAsyncRoutes(routes: RoutesType = [], role: Role): RoutesType {
  const ret: RoutesType = []
  routes.forEach((route) => {
    if (hasPermission(route, role)) {
      const curRoute: RouteType = {
        ...route,
        children: [],
      }
      if (route.children && route.children.length)
        curRoute.children = filterAsyncRoutes(route.children, role) || []
      else
        Reflect.deleteProperty(curRoute, 'children')

      ret.push(curRoute)
    }
  })
  return ret
}
