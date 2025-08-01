// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from 'path'

// Configuration Nuxt
export default defineNuxtConfig({
  css: [
    '@/assets/css/main.css'
  ],
  modules: [
    ['@pinia/nuxt', {
      autoImports: ['defineStore', 'storeToRefs']
    }],
    '@nuxtjs/tailwindcss'
  ],
  vite: {
    resolve: {
      alias: {
        '~': resolve(__dirname, '.'),
        '@': resolve(__dirname, '.'),
      }
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
})