import { compression } from 'vite-plugin-compression2'

export default (viteEnv: ImportMetaEnv) => {
  const { VITE_COMPRESS_TYPE = 'gzip' } = viteEnv
  return compression({
    algorithm: VITE_COMPRESS_TYPE,
    include: [/\.html$/, /\.css$/, /\.js$/, /\.ttf$/],
    skipIfLargerOrEqual: true,
  })
}
