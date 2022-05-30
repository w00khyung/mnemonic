module.exports = {
  extends: ['plugin:node/recommended', 'airbnb-base', 'prettier'],
  env: {
    es2020: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
};
