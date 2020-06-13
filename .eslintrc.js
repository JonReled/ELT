module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
      "plugin:react/recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier/@typescript-eslint",
      "plugin:prettier/recommended",
      "plugin:import/errors",
      "plugin:import/warnings"
  ],
  parserOptions: {
      ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
      sourceType: "module", // Allows for the use of imports
      ecmaFeatures: {
          jsx: true // Allows for the parsing of JSX
      }
  },
  settings: {
      react: {
          version: "detect" // Tells eslint-plugin-react to automatically detect the version of React to use
      }
  },
  rules: {
      "@typescript-eslint/explicit-function-return-type": 0,
      "react/no-unescaped-entities": 0,
      "react/prop-types": 0,
      "react/jsx-indent": [2, 2],
      "@typescript-eslint/no-explicit-any": 2,
      "import/no-unresolved": 0,
      "import/order": 2,
      "import/named": 0,
      "@typescript-eslint/no-use-before-define": ["error", { "functions": false }]
  }
};
