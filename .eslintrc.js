module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'airbnb',
    'prettier/react',
    'prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/explicit-function-return-type': 0,
    'react/no-unescaped-entities': 0,
    'react/prop-types': 0,
    indent: 0,
    '@typescript-eslint/no-explicit-any': 0,
    'import/no-unresolved': 0,
    'import/order': 2,
    'import/named': 0,
    'prettier/prettier': ['error'],
    'import/extensions': ['error', 'never'],
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'no-plusplus': 0,
    'no-continue': 0,
    'react/jsx-one-expression-per-line': 0,
    'max-len': ['error', { code: 180 }],
    'react/jsx-props-no-spreading': 0,
    'react/no-unused-prop-types': 0,
    'react/no-array-index-key': 0,
  },
  globals: {
    localStorage: true,
    document: true,
  },
};

/*  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
      modules: true
    },
  },
*/
