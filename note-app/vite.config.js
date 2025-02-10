import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['vmql6d-5173.csb.app'], // Allow the Codesandbox host
    host: true, // Ensure the server is accessible externally
  },
})
