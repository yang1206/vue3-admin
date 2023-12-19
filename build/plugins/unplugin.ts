import { resolve } from 'node:path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
import NaiveUIProResolver from 'naive-ui-pro-components/resolver'
import NaiveUIProImports from 'naive-ui-pro-components/imports'
import type { PluginOption } from 'vite'

/**
 * unplugin-icons插件，自动引入iconify图标
 * usage: https://github.com/antfu/unplugin-icons
 * 图标库: https://icones.js.org/
 */
import Icons from 'unplugin-icons/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import { getRootPath, getSrcPath } from '../utils'

const customIconPath = resolve(getSrcPath(), 'assets/svg')
export const unplugins = [
  AutoImport({
    imports: ['vue', 'vue-router', '@vueuse/core', NaiveUIProImports()],
    dirs: [resolve(getSrcPath(), 'composables')],
    vueTemplate: true,
    dts: resolve(getRootPath(), 'typings/auto-import.d.ts'),
  }),
  Icons({
    compiler: 'vue3',
    customCollections: {
      custom: FileSystemIconLoader(customIconPath),
    },
    scale: 1,
    defaultClass: 'inline-block',
  }),
  Components({
    resolvers: [NaiveUIProResolver(), NaiveUiResolver(), IconsResolver({ customCollections: ['custom'], componentPrefix: 'icon' })],
    dts: resolve(getRootPath(), 'typings/components.d.ts'),
  }),
  createSvgIconsPlugin({
    iconDirs: [customIconPath],
    symbolId: 'icon-custom-[dir]-[name]',
    inject: 'body-last',
    customDomId: '__CUSTOM_SVG_ICON__',
  }),
] as PluginOption[]
