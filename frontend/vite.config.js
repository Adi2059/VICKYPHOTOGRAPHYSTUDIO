import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Jab bhi aapka frontend '/api' se shuru hone wali request bhejaega,
      // Vite usko chupchap live Render backend par divert kar dega!
      '/api': {
        target: 'https://mds-weddings.onrender.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})