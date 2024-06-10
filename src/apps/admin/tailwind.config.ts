// Types
import { type Config } from "tailwindcss";

// Presets
import GlobalPreset from "@beatattoos/ui/global.preset";

export default {
  presets: [GlobalPreset],
  content: ["./src/**/*.tsx"],
  plugins: [],
} satisfies Config;
