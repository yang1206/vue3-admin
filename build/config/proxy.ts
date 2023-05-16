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
