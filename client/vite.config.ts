import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

// https://vite.dev/config/
const isOptimize = process.env.OPTIMIZE === 'true';

export default defineConfig({
  plugins: [
    react(),
      ...(isOptimize? [visualizer({ open: true })]: [])
  ],
  server: {
    allowedHosts: ['localhost', '192.168.17.2', 'video.dasfad.com', 'video.aardvark.guru']
  },
  build: {
    outDir: '../server/dist/public',
    emptyOutDir: true,
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})