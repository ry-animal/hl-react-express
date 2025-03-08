module.exports = {
  root: false,
  extends: ['../.eslintrc.cjs'],
  env: {
    browser: true,
    node: false,
  },
  rules: {
    'jsx-a11y/anchor-is-valid': 'warn',
  },
}; 