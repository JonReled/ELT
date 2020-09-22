module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'airbnb',
    'prettier/react',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
      modules: true
    },
  },
  settings: {
    react: {
      version: '16.13.1', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 0,
    'react/no-unescaped-entities': 0,
    'react/prop-types': 0,
    'react/jsx-indent': [2, 2],
    '@typescript-eslint/no-explicit-any': 0,
    'import/no-unresolved': 0,
    'import/order': 2,
    'import/named': 0,
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    'prettier/prettier': ['error'],
    'import/extensions': ['error', 'never'],
    'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.ts'] }],
    'no-plusplus': 0,
    'no-continue': 0,
    'react/jsx-one-expression-per-line': 0,
    'max-len': ['error', { code: 180 }],
    'react/jsx-props-no-spreading': 0,
    'react/no-unused-prop-types': 0,
  },
  globals: {
    'localStorage': true,
    'document': true
  }
};
