import type { Role } from '@/store'
import { useUserStore } from '@/store'
import { isArray, isString } from '@/utils'

export function useRoles() {
  const useUser = useUserStore()

  function hasPermission(permission: Role | Role[]) {
    const role = useUser.role

    let has = (role === 2)

    if (!has) {
      if (isArray(permission))
        has = (permission as Role[]).includes(role)

      if (isString(permission))
        has = ((permission as Role) === role)
    }

    return has
  }

  return {
    hasPermission,
  }
}
