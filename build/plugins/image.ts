import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default ViteImageOptimizer({
  png: {
    // https://sharp.pixelplumbing.com/api-output#png
    quality: 100,
  },
  jpeg: {
    quality: 100,
  },
  jpg: {
    quality: 100,
  },
  webp: {
    quality: 100,
  },
})
