export default defineNuxtConfig({
  ssr: true,
  modules: [
      ['vuetify-nuxt-module', {
          treeshaking: true,
          defaultAssets: true,
          theme: {
              defaultTheme: 'light',
              dark: false,
              options: {
                  customProperties: true,
                  variations: true,
              },
          },
      }],
  ],
  css: ['~/assets/style.css'],
  compatibilityDate: '2025-07-03',
  runtimeConfig: {
      public: {
          apiBase: process.env.API_BASE_URL || 'http://localhost:8080',
      },
  },
  plugins: ['~/plugins/auth.ts'],

});