<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>
      <span class="logo mr-2"></span>
      Платформа для нутрициологов
    </v-toolbar-title>
    <v-spacer />
    <v-btn icon @click="isDark = !isDark">
      <v-icon>mdi-{{ $vuetify.theme.dark ? 'white-balance-sunny' : 'moon-waxing-crescent' }}</v-icon>
    </v-btn>
    <v-btn text to="/courses/create">Создать услугу</v-btn>
    <v-btn text to="/register">Регистрация</v-btn>
    <v-btn text to="/login">Войти</v-btn>
  </v-app-bar>
</template>

<script setup>
const { $vuetify } = useNuxtApp();
const isDark = ref($vuetify.theme.global.name.value === 'dark');

watch(isDark, (newValue) => {
  $vuetify.theme.global.name.value = newValue ? 'dark' : 'light';
  if (process.client) {
    localStorage.setItem('theme', newValue ? 'dark' : 'light');
  }
});
</script>