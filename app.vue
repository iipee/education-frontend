<template>
  <v-app>
    <app-header />
    <v-main>
      <NuxtPage />
    </v-main>
    <v-footer app color="primary" dark>
      <v-row justify="center" class="py-4">
        <v-col cols="12" class="text-center">
          © 2025 Платформа для нутрициологов
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script setup>
const { $vuetify } = useNuxtApp()
const isDark = ref($vuetify.theme.global.name.value === 'dark')

watch(isDark, (newValue) => {
  $vuetify.theme.global.name.value = newValue ? 'dark' : 'light'
  if (process.client) {
    localStorage.setItem('theme', newValue ? 'dark' : 'light')
  }
})

onMounted(() => {
  if (process.client) {
    const savedTheme = localStorage.getItem('theme')
    isDark.value = savedTheme === 'dark'
    $vuetify.theme.global.name.value = isDark.value ? 'dark' : 'light'
  }
})
</script>