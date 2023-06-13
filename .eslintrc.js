/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  extends: ["@vibefire/config/eslint"], // uses the config in `packages/config/eslint`
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    tsconfigRootDir: __dirname,
    project: [
      "./tsconfig.eslint.json",
      "./apps/*/tsconfig.json",
      "./packages/**/tsconfig.json",
    ],
  },
  settings: {
    next: {
      rootDir: ["apps/vibefire.app", "apps/manage.vibefire.app"],
    },
  },
};

module.exports = config;
