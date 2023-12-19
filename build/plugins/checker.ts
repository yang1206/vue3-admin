import checker from 'vite-plugin-checker'

export default () => {
  return checker({
    typescript: true,
    vueTsc: true,
    eslint: {
      lintCommand: 'eslint --ext ./src/**/*.{.ts,.vue}',
    },
    // stylelint: {
    //   lintCommand: 'stylelint ./src/**/*.{css,scss,vue}',
    // },
  })
}
