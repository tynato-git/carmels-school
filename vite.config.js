import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  assetsInclude: ['**/*.JPG', '**/*.JPEG', '**/*.PNG', '**/*.jpg', '**/*.png', '**/*.jpeg'],
  server: {
    host: true,   // listen on all interfaces
    allowedHosts: [
      'cathedral-deafness-axis.ngrok-free.dev', // 👈 add your ngrok domain
      '*',                                       // 👈 allow all hosts
    ],
  },
})
