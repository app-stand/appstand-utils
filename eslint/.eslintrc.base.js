module.exports = {
  env: {
    node: true,
  },
  extends: ['prettier'],
  parserOptions: {
    ecmaVersion: 2022,
  },
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
}
