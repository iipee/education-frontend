import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: true,
  modules: [
    ['vuetify-nuxt-module', {
      treeshaking: true,
      defaultAssets: true,
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            colors: {
              primary: '#4CAF50',
              secondary: '#2196F3',
              accent: '#FFEB3B',
              error: '#FF5252',
              info: '#2196F3',
              success: '#4CAF50',
              warning: '#FFC107'
            }
          },
          dark: {
            colors: {
              primary: '#66BB6A',
              secondary: '#42A5F5',
              accent: '#FFF176',
              error: '#FF5252',
              info: '#42A5F5',
              success: '#66BB6A',
              warning: '#FFB74D'
            }
          }
        },
        options: {
          customProperties: true,
          variations: true
        }
      }
    }]
  ],
  css: ['~/assets/style.css'],
  compatibilityDate: '2025-07-21',
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:8080'
    }
  },
  plugins: ['~/plugins/auth.ts'],
  components: true,
  vite: {
    server: {
      proxy: {
        '/api': {
          target: process.env.API_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})