import 'uno.css'
import '@/styles/index.scss'
import '@/styles/reset.css'
import 'virtual:svg-icons-register'
import { createApp } from 'vue'
import { browserUpdatePlugin, dayjsPlugin, naiveUiPlugin, vueQueryPlugin } from './plugins'

import App from './App.vue'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'
import { setupDirectives } from '@/directives'

async function setupApp() {
  const app = createApp(App)
  setupStore(app)
  setupDirectives(app)
  await setupRouter(app)

  app.use(browserUpdatePlugin)
    .use(dayjsPlugin)
    .use(naiveUiPlugin)
    .use(vueQueryPlugin).mount('#app')
}
setupApp()
