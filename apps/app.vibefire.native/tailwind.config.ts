import { type Config } from "tailwindcss";

import baseConfig from "@vibefire/config/tailwind";

export default {
  presets: [baseConfig],
  content: ["./src/**/*.{ts,tsx}"],
} satisfies Config;
