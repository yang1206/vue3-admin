type ProxyType = 'dev' | 'test' | 'prod';

interface ProxyConfig {
  /** 匹配代理的前缀，接口地址匹配到此前缀将代理的target地址 */
  prefix: string
  /** 代理目标地址，后端真实接口地址 */
  target: string
}

