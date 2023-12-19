import process from 'node:process'
import type { UserConfig } from 'vite'
import { loadEnv, mergeConfig } from 'vite'
import { defineConfig } from 'vitest/config'
import checker from 'vite-plugin-checker'
import { createViteProxy } from './build/config'
import { setupVitePlugins } from './build/plugins'
import { convertEnv, getRootPath, getSrcPath } from './build/utils'
import { dependencies } from './package.json'

export default defineConfig((configEnv) => {
  const srcPath = getSrcPath()
  const rootPath = getRootPath()
  const isBuild = configEnv.command === 'build'
  const viteEnv = convertEnv(loadEnv(configEnv.mode, process.cwd()))
  const { VITE_PORT, VITE_USE_PROXY, VITE_PROXY_TYPE } = viteEnv

  const userConfig: UserConfig = {
    plugins: setupVitePlugins(viteEnv, isBuild),
    server: {
      host: '0.0.0.0',
      port: Number(VITE_PORT),
      open: false,
      proxy: createViteProxy(VITE_USE_PROXY, VITE_PROXY_TYPE as ProxyType),
    },

  }
  return mergeConfig(userConfig, {
    build: {
      reportCompressedSize: false,
      sourcemap: false,
      chunkSizeWarningLimit: 1024, // chunk 大小警告的限制（单位kb）
      commonjsOptions: {
        ignoreTryCatch: false,
      },
      
    },
    optimizeDeps: {
      include: Object.keys(dependencies),
      exclude: ['vue-demi'],
    },
    resolve: {
      alias: {
        '~': rootPath,
        '@': srcPath,
      },
    },
    test: {
      environment: 'jsdom',
    },
  })
})
