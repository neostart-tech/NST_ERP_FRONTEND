import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'),
      // or, if your source code is in a 'src' folder:
      // '~': path.resolve(__dirname, 'src'),
    },
  },
})
