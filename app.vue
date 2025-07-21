<template>
  <v-app>
    <AppHeader />
    <v-main>
      <NuxtPage />
    </v-main>
    <v-footer app>
      © 2025 Платформа для нутрициологов
    </v-footer>
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue'
import { useNuxtApp } from 'nuxt/app'

const { $vuetify } = useNuxtApp()

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  $vuetify.theme.global.name = savedTheme || 'light'
})
</script>