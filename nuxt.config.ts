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
              primary: '#1976D2',
              secondary: '#424242',
              accent: '#82B1FF',
              error: '#FF5252',
              info: '#2196F3',
              success: '#4CAF50',
              warning: '#FFC107'
            }
          },
          dark: {
            colors: {
              primary: '#2196F3',
              secondary: '#B0BEC5',
              accent: '#FF4081',
              error: '#FF5252',
              info: '#2196F3',
              success: '#4CAF50',
              warning: '#FB8C00'
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
  compatibilityDate: '2025-07-03',
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:8080'
    }
  },
  plugins: ['~/plugins/auth.ts']
})