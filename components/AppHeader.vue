<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>
      <span class="logo mr-2"></span>
      Платформа для нутрициологов
    </v-toolbar-title>
    <v-spacer />
    <v-btn icon @click="toggleTheme">
      <v-icon>mdi-{{ $vuetify.theme.dark ? 'white-balance-sunny' : 'moon-waxing-crescent' }}</v-icon>
    </v-btn>
    <v-btn v-if="isLoggedIn && role === 'nutritionist'" text to="/courses/create">Создать услугу</v-btn>
    <v-btn v-if="!isLoggedIn" text to="/login">Войти</v-btn>
    <v-btn v-if="isLoggedIn" text @click="logout">Выйти</v-btn>
  </v-app-bar>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNuxtApp } from 'nuxt/app'

const { $vuetify } = useNuxtApp()
const router = useRouter()
const isDark = ref(false)
const token = localStorage.getItem('token')
const isLoggedIn = ref(!!token)
const role = ref(localStorage.getItem('role') || '')

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  isDark.value = savedTheme === 'dark'
  $vuetify.theme.global.name = isDark.value ? 'dark' : 'light'
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  $vuetify.theme.global.name = isDark.value ? 'dark' : 'light'
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  isLoggedIn.value = false
  role.value = ''
  router.push('/login')
}
</script>