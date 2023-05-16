import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import unocss from 'unocss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import VueDevTools from 'vite-plugin-vue-devtools'
import { visualizer } from 'rollup-plugin-visualizer'
import mkcert from 'vite-plugin-mkcert'
import viteCompression from 'vite-plugin-compression'
import unplugins from './unplugin'
import { setupMockPlugin } from './mock'
import type { env } from '~/env'

export function setupVitePlugins(viteEnv: typeof env, isBuild: boolean): PluginOption[] {
  const plugins = [
    vue({
      script: {
        defineModel: true,
      },
    }),
    VueDevTools(),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Vue3 Admin',
        short_name: 'Vue3 Admin',
        description: 'Vue3 Admin description',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
    mkcert(),
    ...unplugins, unocss()]
  if (viteEnv.VITE_USE_MOCK)
    plugins.push(setupMockPlugin(isBuild))

  if (viteEnv.VITE_USE_COMPRESS) {
    plugins.push(
      viteCompression({ algorithm: viteEnv.VITE_COMPRESS_TYPE || 'gzip' }),
    )
  }

  if (isBuild) {
    plugins.push(
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
    )
  }

  return plugins
}
