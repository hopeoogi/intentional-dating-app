
// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: [
    'expo',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'import'],
  root: true,
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  ignorePatterns: ['/dist/*', '/public/*', '/babel-plugins/*', '/backend/*'],
  env: {
    browser: true,
    node: true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    },
    'import/ignore': ['react-native']
  },
  rules: {
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/prefer-as-const": "off",
    "@typescript-eslint/no-var-requires": "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-empty-object-type": "off",
    "@typescript-eslint/no-wrapper-object-types": "off",
    "@typescript-eslint/ban-tslint-comment": "off",
    "react/no-unescaped-entities": "off",
    "import/no-unresolved": ["error", { 
      ignore: [
        'react-native',
        'expo-glass-effect',
        'expo-haptics',
        'expo-router/unstable-native-tabs',
        '@bacons/apple-targets'
      ]
    }],
    "import/namespace": "off",
    "prefer-const": "off",
    "react/prop-types": 1,
    "no-case-declarations": "off",
    "no-empty": "off",
    "react/display-name": "off",
    "no-constant-condition": "off",
    "no-var": "off",
    "no-useless-escape": "off"
  },
  overrides: [
    {
      files: ['metro.config.js', '*.config.js'],
      env: {
        node: true
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'no-undef': 'off'
      }
    }
  ]
};
