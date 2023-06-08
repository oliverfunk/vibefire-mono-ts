import { type Config } from "tailwindcss";

import baseConfig from "@vibefire/tailwind";

export default {
  presets: [baseConfig],
  content: ["./src/**/*.{ts,tsx}"],
} satisfies Config;
