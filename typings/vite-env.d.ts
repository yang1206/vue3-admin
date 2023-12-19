/// <reference types="vite/client" />

type ProxyType = 'dev' | 'test' | 'prod'

interface ProxyConfig {
  /** 匹配代理的前缀，接口地址匹配到此前缀将代理的target地址 */
  prefix: string
  /** 代理目标地址，后端真实接口地址 */
  target: string
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_PORT: number
  readonly VITE_USE_MOCK?: boolean
  readonly VITE_USE_PROXY?: boolean
  readonly VITE_USE_HASH: 'true' | 'false'
  readonly VITE_APP_TITLE_VUE: string
  readonly VITE_PUBLIC_PATH: string
  readonly VITE_BASE_API: string
  readonly VITE_PROXY_TYPE?: ProxyType
  readonly VITE_USE_COMPRESS?: boolean
  readonly VITE_PWA?: boolean
  readonly VITE_VISUALIZER?: boolean
  readonly VITE_IMAGE_OPTIMIZER?: boolean
  readonly VITE_DEVTOOL?: boolean
  readonly VITE_CHECKER?: boolean
  readonly VITE_LEGACY?: boolean
  /**
   * 为开发服务器提供 https 支持
   */
  readonly VITE_MKERT?: boolean

  readonly VITE_COMPRESS_TYPE?: 'gzip' | 'brotliCompress' | 'deflate' | 'deflateRaw'
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<{}, {}, any>
  export default component
}
