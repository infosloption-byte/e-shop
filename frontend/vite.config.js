import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Ensure this is imported

export default defineConfig({
  plugins: [
    tailwindcss(), // Tailwind MUST come before react()
    react(),
  ],
})