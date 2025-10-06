import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  base: '/streamdown-solid/',
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
