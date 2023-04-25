import { createProdMockServer } from 'vite-plugin-mock/client'
import api from './api'

export function setupProdMockServer() {
  createProdMockServer(api)
}
