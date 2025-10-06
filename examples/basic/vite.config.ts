import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [solid(), tailwindcss()],
  base: '/',
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
  optimizeDeps: {
    include: [
      // 'micromark',
      // 'micromark-util-chunked',
      // 'micromark-util-resolve-all',
      // 'micromark-util-symbol',
      // 'micromark-util-character',
      'debug',
      'extend',
    ],
  },
})
