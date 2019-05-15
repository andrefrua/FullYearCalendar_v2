module.exports = {
  parser: "babel-eslint",
  extends: ["airbnb-base", "prettier"],
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module"
  },
  env: {
    browser: true,
    es6: true,
    jest: true
  },
  rules: {
    "import/extensions": ["error", "always"],
    "no-underscore-dangle": ["error", { "allowAfterThis": true }],
    "no-param-reassign": ["error", { "props": false }]
  }
};
