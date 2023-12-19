import type { App } from 'vue'
import setupPermissionDirective from './permission'
import setupDraggableDirective from './draggable'

/** setup custom vue directives. - [安装自定义的vue指令] */
export function setupDirectives(app: App) {
  setupPermissionDirective(app)
  setupDraggableDirective(app)
}
