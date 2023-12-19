import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueMacros from 'unplugin-vue-macros/vite'
import unocss from 'unocss/vite'
import devtools from 'vite-plugin-vue-devtools'
import mkcert from 'vite-plugin-mkcert'
import inspect from 'vite-plugin-inspect'
import { warmup } from 'vite-plugin-warmup'
import { webUpdateNotice } from '@plugin-web-update-notification/vite'
import compress from './compress'
import { unplugins } from './unplugin'
import pwa from './pwa'
import legacy from './legacy'
import { setupMockPlugin } from './mock'
import visualizer from './visualizer'
import imageOptimizer from './image'

import checker from './checker'

export function setupVitePlugins(viteEnv: ImportMetaEnv, isBuild: boolean): PluginOption[] {
  const plugins = [
    warmup({
      clientFiles: ['./src/**/*.{js,jsx,ts,tsx,vue,json}'],
    }),
    VueMacros({
      plugins: {
        vue: vue({
          script: {
            defineModel: true,
          },
        }),
        vueJsx: vueJsx(),
      },
    }),
    ...unplugins,
    unocss(),
    webUpdateNotice({
      checkInterval: 60 * 60 * 1000, // 60m
      notificationProps: {
        title: '📢 更新通知',
        description: '版本已更新，请刷新页面。',
        buttonText: '刷新',
        dismissButtonText: '忽略',
      },
    }),
    inspect(),

  ] as PluginOption[]
  if (viteEnv.VITE_CHECKER)
    plugins.push(checker())
  if (viteEnv.VITE_USE_MOCK)
    plugins.push(setupMockPlugin(isBuild))

  if (viteEnv.VITE_USE_COMPRESS)
    plugins.push(compress(viteEnv))

  if (viteEnv.VITE_PWA)
    plugins.push(pwa())

  if (viteEnv.VITE_VISUALIZER)
    plugins.push(visualizer as PluginOption)

  if (viteEnv.VITE_IMAGE_OPTIMIZER)
    plugins.push(imageOptimizer)

  if (viteEnv.VITE_DEVTOOL)
    plugins.push(devtools())
  if (viteEnv.VITE_MKERT)
    plugins.push(mkcert())

  if (viteEnv.VITE_LEGACY)
    plugins.push(legacy)


  return plugins
}
