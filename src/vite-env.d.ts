
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_PORT: number
  readonly VITE_USE_MOCK?: boolean
  readonly VITE_USE_PROXY?: boolean
  readonly VITE_APP_GLOB_BASE_API:string
  readonly VITE_USE_HASH: 'true' | 'false'
  readonly VITE_APP_TITLE_VUE: string
  readonly VITE_PUBLIC_PATH: string
  readonly VITE_BASE_API: string
  readonly VITE_PROXY_TYPE?: ProxyType
  readonly VITE_USE_COMPRESS?: boolean
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
