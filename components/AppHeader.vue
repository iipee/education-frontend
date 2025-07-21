<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>
      <span class="logo mr-2"></span>
      Платформа для нутрициологов
    </v-toolbar-title>
    <v-spacer />
    <v-btn text to="/">Главная страница</v-btn>
    <v-btn icon @click="toggleTheme">
      <v-icon>mdi-{{ $vuetify.theme.dark ? 'white-balance-sunny' : 'moon-waxing-crescent' }}</v-icon>
    </v-btn>
    <v-btn v-if="isLoggedIn && role === 'nutritionist'" text to="/courses/create">Создать услугу</v-btn>
    <v-btn v-if="!isLoggedIn" text to="/login">Войти</v-btn>
    <v-btn v-if="isLoggedIn" text @click="logout">Выйти</v-btn>
  </v-app-bar>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useNuxtApp } from 'nuxt/app'

const { $vuetify } = useNuxtApp()
const router = useRouter()
const isDark = ref(false)
const token = ref(null)
const role = ref('')

const isLoggedIn = computed(() => !!token.value)

onMounted(() => {
  if (process.client) {
    token.value = localStorage.getItem('token')
    role.value = localStorage.getItem('role') || ''
    const savedTheme = localStorage.getItem('theme')
    isDark.value = savedTheme === 'dark'
    $vuetify.theme.global.name = isDark.value ? 'dark' : 'light'
  }
})

watch(isDark, (newVal) => {
  $vuetify.theme.global.name = newVal ? 'dark' : 'light'
  if (process.client) {
    localStorage.setItem('theme', newVal ? 'dark' : 'light')
  }
})

const toggleTheme = () => {
  isDark.value = !isDark.value
}

const logout = () => {
  if (process.client) {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
  }
  token.value = null
  role.value = ''
  router.push('/login')
}
</script>