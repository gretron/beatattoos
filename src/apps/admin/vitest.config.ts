import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    include: ["src/__tests__/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    globals: true,
    environment: "jsdom",
    setupFiles: ["dotenv/config"],
  },
});
