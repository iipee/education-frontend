<template>
  <v-app-bar app color="primary" dark height="64">
    <v-toolbar-title class="text-h6" aria-label="Логотип NutriPlatform">
      <span style="color: #4CAF50;">NutriPlatform</span>
    </v-toolbar-title>
    <v-spacer />
    <v-btn icon to="/search" aria-label="Поиск курсов">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
    <v-btn text to="/" aria-label="Перейти на главную страницу">Главная</v-btn>
    <v-btn 
      v-if="isLoggedIn && role === 'nutri'" 
      text 
      to="/courses/create" 
      aria-label="Создать новый курс"
    >
      Создать курс
    </v-btn>
    <v-btn 
      v-if="!isLoggedIn" 
      text 
      to="/login" 
      aria-label="Войти в аккаунт"
    >
      Войти
    </v-btn>
    <v-btn 
      v-if="isLoggedIn" 
      text 
      to="/profile" 
      aria-label="Перейти в профиль"
    >
      Профиль
    </v-btn>
    <v-btn 
      v-if="isLoggedIn" 
      text 
      @click="logout" 
      aria-label="Выйти из аккаунта"
    >
      Выйти
    </v-btn>
    <v-menu v-if="isLoggedIn" bottom offset-y transition="scale-transition">
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props" aria-label="Уведомления">
          <v-badge :content="unreadCount" color="error" overlap v-if="unreadCount > 0">
            <v-icon>mdi-bell</v-icon>
          </v-badge>
          <v-icon v-else>mdi-bell</v-icon>
        </v-btn>
      </template>
      <v-list aria-label="Список уведомлений">
        <v-list-item 
          v-for="(noti, index) in notifications" 
          :key="index" 
          @click="handleNotification(noti)" 
          aria-label="Уведомление"
        >
          <v-list-item-title>{{ noti.content }}</v-list-item-title>
          <v-list-item-subtitle>{{ noti.created_at }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item v-if="notifications.length === 0">
          <v-list-item-title>Нет уведомлений</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn icon @click="toggleTheme" aria-label="Переключить тему">
      <v-icon color="#FFB300" v-if="isDark">mdi-white-balance-sunny</v-icon>
      <v-icon color="#3949AB" v-else>mdi-moon-waxing-crescent</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRuntimeConfig } from 'nuxt/app'
import { useNuxtApp } from 'nuxt/app'

const { $vuetify } = useNuxtApp()
const config = useRuntimeConfig()
const router = useRouter()
const isDark = ref(false)
const token = ref(null)
const role = ref('')
const notifications = ref([])
const ws = ref(null)

const isLoggedIn = computed(() => !!token.value)
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

onMounted(() => {
  if (process.client) {
    token.value = localStorage.getItem('token')
    role.value = localStorage.getItem('role') || ''
    const savedTheme = localStorage.getItem('theme') || 'light'
    isDark.value = savedTheme === 'dark'
    $vuetify.theme.global.name = isDark.value ? 'dark' : 'light'
    if (isLoggedIn.value && token.value) {
      loadNotifications()
      connectWebSocket()
    }
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
    localStorage.removeItem('userId')
  }
  token.value = null
  role.value = ''
  if (ws.value) ws.value.close()
  router.push('/login')
}

const loadNotifications = async () => {
  if (!token.value) return
  const headers = { Authorization: `Bearer ${token.value}` }
  const { data, error } = await useFetch(`${config.public.apiBase}/api/notifications`, { headers })
  if (!error.value) {
    notifications.value = data.value || []
  } else if (error.value.statusCode === 401) {
    logout()
  }
}

const connectWebSocket = () => {
  if (!token.value) return
  ws.value = new WebSocket(`${config.public.wsBase}/ws?token=${token.value}`)
  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.type === 'notification') {
      notifications.value.unshift(data.data)
    }
  }
  ws.value.onclose = () => {
    setTimeout(connectWebSocket, 5000)
  }
}

const handleNotification = async (noti) => {
  if (!noti.read) {
    const headers = { Authorization: `Bearer ${token.value}` }
    await useFetch(`${config.public.apiBase}/api/notifications/${noti.id}/read`, { method: 'PUT', headers })
    noti.read = true
  }
  if (noti.type === 'message') {
    router.push(`/profile/${noti.related_id}`)
  } else if (noti.type === 'payment') {
    router.push('/profile')
  }
}
</script>