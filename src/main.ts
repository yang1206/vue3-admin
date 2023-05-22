import 'uno.css'
import '@/styles/index.scss'
import '@/styles/reset.css'
import 'virtual:svg-icons-register'

import { createApp } from 'vue'
import type { VueQueryPluginOptions } from '@tanstack/vue-query'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'
import { setupDirectives } from '@/directives'

const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  },
}
async function setupApp() {
  const app = createApp(App)
  await setupStore(app)
  await setupRouter(app)
  setupDirectives(app)

  app.use(VueQueryPlugin, vueQueryPluginOptions).mount('#app')
}
setupApp()
