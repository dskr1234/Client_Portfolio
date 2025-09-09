import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // point to your Express API (default 4000)
      "/api": "http://localhost:4000",
    },
  },
});
