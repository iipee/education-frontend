export default defineNuxtConfig({
  ssr: true,
  modules: [
      ['vuetify-nuxt-module', {
          treeshaking: true,
          defaultAssets: true,
      }],
  ],
  css: ['~/assets/style.css'],
  compatibilityDate: '2025-07-03', // Добавлено
});