import { defineConfig } from "vite";
import path from "node:path";
export default defineConfig({
  root: path.resolve("tests/browser-ui"),
  server: {
    host: "127.0.0.1",
    port: 5174,
    strictPort: true,
    fs: { allow: [process.cwd()] },
  },
  resolve: {
    alias: {
      "@": path.resolve("src"),
      "next/link": path.resolve("tests/browser-ui/link.tsx"),
      "next/navigation": path.resolve("tests/browser-ui/next-adapters.tsx"),
      "next/dynamic": path.resolve("tests/browser-ui/dynamic.tsx"),
    },
  },
});
