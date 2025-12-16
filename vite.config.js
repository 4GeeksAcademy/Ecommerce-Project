import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      "/api": {
        target: "https://congenial-palm-tree-g46rg4qj4qx539rq7-3001.app.github.dev",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});