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
            dark: false,
            colors: {
              primary: '#4CAF50',
              light: '#E8F5E9',
              dark: '#2E7D32',
              text: '#333',
              bg: '#F0FDFA',
              error: '#FF5252',
              success: '#4CAF50',
              warning: '#FFB74D'
            }
          },
          dark: {
            dark: true,
            colors: {
              primary: '#66BB6A',
              light: '#1C352D',
              dark: '#388E3C',
              text: '#FFF',
              bg: '#1C352D',
              error: '#FF5252',
              success: '#4CAF50',
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
  compatibilityDate: '2025-07-24',
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:8080',
      wsBase: process.env.WS_BASE_URL || 'ws://localhost:8080'
    }
  },
  plugins: ['~/plugins/mitt.ts', '~/plugins/auth.ts'],
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
    },
    ssr: {
      noExternal: [/vuetify/]
    }
  }
})