import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ],
  server: {
    allowedHosts: ['localhost', '192.168.17.2', 'video.dasfad.com', 'video.aardvark.guru'],
  },
})
