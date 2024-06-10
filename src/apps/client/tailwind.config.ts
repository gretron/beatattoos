import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  presets: [require("../../packages/ui/global.preset")],
  content: ["./src/**/*.tsx"],
  plugins: [],
} satisfies Config;
