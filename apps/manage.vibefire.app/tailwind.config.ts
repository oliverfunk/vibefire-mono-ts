import type { Config } from "tailwindcss";

import baseConfig from "@vibefire/tailwind";

export default {
  content: ["./src/**/*.tsx"],
  presets: [baseConfig],
  plugins: [require("@headlessui/tailwindcss")],
} satisfies Config;
