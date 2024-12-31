import { type Config } from "tailwindcss";
import GlobalPreset from "@beatattoos/ui/global.preset";

export default {
  presets: [GlobalPreset],
  content: ["./src/**/*.tsx"],
  plugins: [],
} satisfies Config;
