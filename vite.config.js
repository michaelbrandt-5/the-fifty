import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Prerendering is run as a separate post-build step via scripts/prerender.mjs.
// (vite-plugin-prerender ships an ancient bundled Chrome that won't launch on modern systems.)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
