import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add this define block to shim process.env
  define: {
    'process.env': {}
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
