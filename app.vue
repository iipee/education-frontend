<template>
  <v-app :theme="$vuetify.theme.global.name">
    <AppHeader />
    <v-main style="padding-top: 64px;">
      <NuxtPage />
    </v-main>
    <v-footer app color="primary" dark class="text-center">
      <v-col cols="12">
        NutriPlatform © 2025 | <NuxtLink to="/">Главная</NuxtLink> | <NuxtLink to="/search">Поиск</NuxtLink> | <NuxtLink to="/profile">Профиль</NuxtLink>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script setup>
</script>