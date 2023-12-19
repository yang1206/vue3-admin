import type { ProxyOptions } from 'vite'

export function createViteProxy(isUseProxy: boolean | 'true' | 'false' = true, proxyType: ProxyType) {
  if (!isUseProxy)
    return undefined

  const proxyConfig = getProxyConfig(proxyType)

  const proxy: Record<string, string | ProxyOptions> = {
    [proxyConfig.prefix]: {
      target: proxyConfig.target,
      changeOrigin: true,
      rewrite: (path: string) => path.replace(new RegExp(`^${proxyConfig.prefix}`), '/'),
      configure: (proxy, options) => {
        // 配置此项可在响应头中看到请求的真实地址
        proxy.on('proxyRes', (proxyRes, req) => {
          proxyRes.headers['x-real-url'] = new URL(req.url || '', options?.target as string)?.href || ''
        })
      },
    },
  }
  return proxy
}
const proxyConfigMappings: Record<ProxyType, ProxyConfig> = {
  dev: {
    prefix: '/app',
    target: '',
  },
  test: {
    prefix: '/api',
    target: 'http://192.168.0.107:8080',
  },
  prod: {
    prefix: '/api',
    target: 'http://localhost:8080',
  },
}

export function getProxyConfig(envType: ProxyType = 'dev'): ProxyConfig {
  return proxyConfigMappings[envType]
}
