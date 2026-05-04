// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from 'path'

// Configuration Nuxt
export default defineNuxtConfig({
  css: [
    '~/assets/css/main.css'
  ],

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxt/icon',
    // Retirez '@nuxtjs/axios' - Nuxt 3 a axios intégré via useFetch
  ],

  // Configuration des alias pour les imports
  alias: {
    '@': resolve(__dirname, './app'),
    '~': resolve(__dirname, './'),
  },

  vite: {
    resolve: {
      alias: {
        '@': resolve(__dirname, './app'),
        '~': resolve(__dirname, './'),
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

  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8000/api' // URL de base de votre API
    }
  }
})