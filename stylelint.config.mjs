/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
    'stylelint-config-html',
    'stylelint-config-recess-order',
  ],
  plugins: ['stylelint-order'],
  rules: {
    'keyframes-name-pattern': '^[a-z]+([A-Z][a-z]*)*$',
    'no-descending-specificity': null,
    'no-empty-source': null,
    'selector-class-pattern': [
      '^([#a-z][$#{}a-z0-9]*)((-{1,2}|_{2})[$#{}a-z0-9]+)*$',
      {
        message: 'Expected class selector to be kebab-case',
      },
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep', 'global'],
      },
    ],
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted'],
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.(html|vue)'],
      customSyntax: 'postcss-html',
    },
    // {
    //   files: ['*.scss', '**/*.scss'],
    //   customSyntax: 'postcss-scss',
    //   extends: ['stylelint-config-standard-scss', 'stylelint-config-recommended-vue/scss'],
    //   rule: {
    //     'scss/percent-placeholder-pattern': null,
    //   },
    // },
  ],
  ignoreFiles: [
    'node_modules/**/*',
    'dist/**/*',
    'public/**/*',
    'output/**/*',
    'coverage/**/*',
    'temp/**/*',
    '**/*.js',
    '**/*.cjs',
    '**/*.mjs',
    '**/*.ts',
    '**/*.tsx',
    '**/*.svg',
    '**/*.gif',
    '**/*.md',
  ],
}
