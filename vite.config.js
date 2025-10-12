import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/gimnasio-v0/" : "/",  // 👈 dinámico
  plugins: [react()],
  build: {
    outDir: "docs",   // para GitHub Pages
  },
}))