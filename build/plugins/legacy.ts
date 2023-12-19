import legacy from '@vitejs/plugin-legacy'
export default legacy({
  targets: ['defaults', 'edge >= 79', 'firefox >= 67', 'safari >= 12', 'chrome >= 63'],
  polyfills: true,
  modernPolyfills: true,
})
