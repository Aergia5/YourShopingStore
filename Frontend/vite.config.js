import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss() 
  ],
  build: {
    outDir: 'dist',
  },    
  base: './',
  // Proxy /api to the Express backend in dev so auth hits Twilio/Mongo (see Frontend/src/api/api.js).
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
