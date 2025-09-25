import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import postcss from "./postcss.config.js";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss,
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
