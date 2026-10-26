import { defineConfig } from "vite";
import path from "node:path";
export default defineConfig({
  root: path.resolve("tests/browser-ui"),
  publicDir: path.resolve("public"),
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
      "next/image": path.resolve("tests/browser-ui/image.tsx"),
      "next/navigation": path.resolve("tests/browser-ui/next-adapters.tsx"),
      "next/dynamic": path.resolve("tests/browser-ui/dynamic.tsx"),
    },
  },
});
