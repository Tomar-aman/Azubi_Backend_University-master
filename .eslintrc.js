module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ["standard-with-typescript", "plugin:prettier/recommended"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off", // Allow implicit return types on functions
    "@typescript-eslint/no-floating-promises": ["error", { ignoreIIFE: true }],
    "@typescript-eslint/strict-boolean-expressions": "off", // Allow if (foo) { ... } where foo is a boolean
    "@typescript-eslint/no-misused-promises": "off", // Allow Promise<void> to be used in async functions
    "no-console": "error", // Disallow console statements
    "no-extra-boolean-cast": "off", // Allow !!foo expressions
    "prettier/prettier": "error", // Ensure Prettier formatting rules are enforced
    quotes: ["error", "double"], // Enforce double quotes
    semi: ["error", "always"], // Enforce semicolons
  },
};
