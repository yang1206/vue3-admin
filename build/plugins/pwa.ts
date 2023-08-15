import { VitePWA } from 'vite-plugin-pwa'

export default function setupVitePwa() {
  return VitePWA({
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
  })
}
