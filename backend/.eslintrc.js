module.exports = {
  root: false, // use root config, but add specific overrides
  extends: ['../.eslintrc.js'],
  env: {
    browser: false,
    node: true,
  },
  rules: {
    // Add backend-specific rules
    'no-console': 'off', // Allow console in backend
  },
}; 