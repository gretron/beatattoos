// Types
import { type Config } from "tailwindcss";

// Presets
import GlobalPreset from "@beatattoos/ui/global.preset";

export default {
  presets: [GlobalPreset],
  content: ["./src/**/*.tsx", "../../packages/ui/src/**/*.tsx"],
  safelist: [
    "bg-error-300",
    "bg-success-300",
    "bg-warning-300",
    "bg-info-300",
    "border-error-500",
    "border-success-500",
    "border-warning-500",
    "border-info-500",
  ],
  plugins: [],
} satisfies Config;
