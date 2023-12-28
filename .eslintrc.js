/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  extends: ["./packages/config/eslint/index.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    tsconfigRootDir: __dirname,
    project: [
      "./tsconfig.eslint.json",
      "./services/*/tsconfig.json",
      "./apps/*/tsconfig.json",
      "./packages/*/tsconfig.json",
    ],
  },
  settings: {
    next: {
      rootDir: ["apps/vibefire.app"],
    },
  },
};

module.exports = config;
