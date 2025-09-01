import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // ▼▼▼ TAMBAHKAN BAGIAN INI ▼▼▼
  server: {
    proxy: {
      // Semua request yang diawali dengan '/api' akan diteruskan ke backend
      '/api': {
        target: 'http://localhost:5000', // Alamat server backend Anda
        changeOrigin: true, // Diperlukan agar backend menerima request
      },
    },
  },
  // ▲▲▲ SAMPAI SINI ▲▲▲
})