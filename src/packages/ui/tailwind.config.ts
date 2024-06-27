// Types
import { type Config } from "tailwindcss";

// Presets
import GlobalPreset from "./global.preset";

export default {
  presets: [GlobalPreset],
  content: ["./src/**/*.tsx", "./src/*.tsx"],
  plugins: [],
} satisfies Config;
