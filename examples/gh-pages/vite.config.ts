import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [solid(), tailwindcss()],
  base: '/streamdown-solid/',
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
  optimizeDeps: {
    include: ['debug', 'extend'],
  },
})
