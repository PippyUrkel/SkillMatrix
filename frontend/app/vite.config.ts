import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from "kimi-plugin-inspect-react"

export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react()],
  server: {
    host: true, // allow external access
    allowedHosts: [
      "undelved-unelusively-shawanda.ngrok-free.dev"
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})