import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://redesigned-memory-j9ppw5rpq94hj5ww-3000.app.github.dev',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
