import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  // base: "/",
  // preview: {
  //   port: 8080,
  //   strictPort: true
  // },
  // server: {
  //   port: 8080,
  //   strictPort: true,
  //   host: true,
  //   origin: "http://0.0.0.0:8080", // maybe the host 0.0.0.0 will be used when hosted via tailscale
  // },
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
