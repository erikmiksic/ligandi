import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { //Sučelje će sada sve zahtjeve na /api/... slati backendu, pa se ne moramo brinuti o CORS-u
    proxy: {
      '/api': 'http://127.0.0.1:8000',
    },
  },
})
