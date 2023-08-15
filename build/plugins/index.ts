import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import unocss from 'unocss/vite'
import devtools from 'vite-plugin-vue-devtools'
import mkcert from 'vite-plugin-mkcert'
import compress from './compress'
import unplugins from './unplugin'
import pwa from './pwa'
import { setupMockPlugin } from './mock'
import visualizer from './visualizer'
import imageOptimizer from './image'

export function setupVitePlugins(viteEnv: ImportMetaEnv, isBuild: boolean): PluginOption[] {
  const plugins = [
    vue({
      script: {
        defineModel: true,
      },
    }),
    ...unplugins, unocss()]
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

  return plugins
}
