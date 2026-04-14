import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/hardware_management_app/',
  plugins: [react()],
  optimizeDeps: {
    include: ['xlsx'],
  },
})
