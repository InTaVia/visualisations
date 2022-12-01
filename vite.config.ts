import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'

const config = defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
})

export default config
