module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    quotes: ["error", "single"],
    "linebreak-style": ["error", "windows"],
    "no-plusplus": [2, { allowForLoopAfterthoughts: true }],
    "max-len": ["error", { "code": 200 }]
  },
};
