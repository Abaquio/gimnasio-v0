// vite.config.js
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  base: "/gimnasio-v0/",  // 👈 usa el nombre exacto del repo en GitHub
  plugins: [react()],
  build: {
    outDir: "dist",       // carpeta temporal de build
  },
})