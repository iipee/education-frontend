<template>
  <v-app :theme="currentTheme">
    <AppHeader />
    <v-main style="padding-top: 64px;">
      <NuxtPage />
    </v-main>
    <v-footer app color="primary" :dark="currentTheme === 'dark'" class="text-center" style="z-index: 1004;">
      <v-col cols="12">
        NutriPlatform © 2025 | <NuxtLink to="/">Главная</NuxtLink> | <NuxtLink to="/search">Поиск</NuxtLink> | <NuxtLink to="/profile">Профиль</NuxtLink>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useNuxtApp } from 'nuxt/app'

const { $vuetify } = useNuxtApp()
const currentTheme = ref('light')

onMounted(() => {
  if (process.client) {
    const savedTheme = localStorage.getItem('theme') || 'light'
    currentTheme.value = savedTheme
    $vuetify.theme.global.name = savedTheme
    document.documentElement.setAttribute('data-theme', savedTheme)
  }
})

watch(currentTheme, (newTheme) => {
  if (process.client) {
    $vuetify.theme.global.name = newTheme
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }
})
</script>

<style>
[data-theme="dark"] {
  background-color: #1C352D !important;
  color: #FFF !important;
}
[data-theme="light"] {
  background-color: #F0FDFA !important;
  color: #333 !important;
}
</style>