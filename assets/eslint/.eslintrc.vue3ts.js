module.exports = {
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/typescript/recommended',
    './.eslintrc.base.js',
  ],
  rules: {
    'vue/no-deprecated-slot-attribute': 'off',
    'vue/no-unused-components': 'warn',
  },
}
