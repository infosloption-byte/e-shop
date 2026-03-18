import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('https://api.ycusriya.online/api'),
    'import.meta.env.VITE_PADDLE_CLIENT_TOKEN': JSON.stringify('test_201562309f24cd4bfbd8e55a6bb'),
    'import.meta.env.VITE_PADDLE_PRICE_ID': JSON.stringify('pri_01km0e934h5zyra9eb9a64c6he'),
  }
})