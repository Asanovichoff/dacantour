import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next", "e2e/**"],
  },
  resolve: {
    // Guard against a second React being hoisted into the workspace root, which
    // breaks rendering with "A React Element from an older version of React".
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
