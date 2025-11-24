import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Remove the "root: './'" line if you added it earlier.
  // Vite automatically looks for index.html in the root, which is what we want.
  build: {
    outDir: 'dist',
  }
})