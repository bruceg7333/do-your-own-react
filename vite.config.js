import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
    jsxRuntime: 'classic', // Use classic JSX transform (not automatic)
    jsxFactory: 'Didact.createElement', // Replace React.createElement
  })],
})
