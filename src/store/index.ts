import { createPinia } from 'pinia'
import type { App } from 'vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export async function setupStore(app: App) {
  const pinia = createPinia()
  app.use(pinia)
  pinia.use(piniaPluginPersistedstate)
}

export * from './modules'
