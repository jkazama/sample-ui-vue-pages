module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    'eslint:recommended'
  ],
  // add your custom rules here
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': 'off',
    'comma-dangle': 'off',
    'semi': ["error", "always"],
    'arrow-parens': ['error', 'as-needed'],
    'lines-between-class-members': 'off',
    'no-unused-vars': ["error", { vars: "all", args: "none" }]
  }
}
