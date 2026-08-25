import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.BUILD_TARGET === "ios" ? "./" : "/gensexa-mini-app/",
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
