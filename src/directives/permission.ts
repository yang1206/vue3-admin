import type { App, Directive } from 'vue'
import { useRoles } from '@/composables'
import type { Role } from '@/store'

export default function setupPermissionDirective(app: App) {
  const { hasPermission } = useRoles()

  function updateElVisible(el: HTMLElement, permission: Role | Role[]) {
    if (!permission)
      throw new Error('need roles: like v-permission="\0\", v-permission="[\'1\', \'2]"')

    if (!hasPermission(permission))
      el.parentElement?.removeChild(el)
  }

  const permissionDirective: Directive<HTMLElement, Role | Role[]> = {
    mounted(el, binding) {
      updateElVisible(el, binding.value)
    },
    beforeUpdate(el, binding) {
      updateElVisible(el, binding.value)
    },
  }

  app.directive('permission', permissionDirective)
}
