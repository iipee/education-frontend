<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-6" aria-label="Профиль пользователя">
          <v-card-title class="justify-center">
            <h2 aria-label="Профиль">Профиль</h2>
          </v-card-title>
          <v-card-text>
            <v-alert v-if="errorMessage" type="error" dismissible class="mb-4" aria-label="Сообщение об ошибке">
              {{ errorMessage }}
            </v-alert>
            <v-row>
              <v-col cols="12">
                <h3 aria-label="Имя пользователя">{{ profile.full_name || profile.username || 'Имя не указано' }}</h3>
              </v-col>
              <v-col cols="12" v-if="profile.role === 'nutri'">
                <h4 aria-label="Услуги">Услуги</h4>
                <p v-if="profile.description" aria-label="Описание">{{ profile.description }}</p>
                <p v-else aria-label="Описание не указано">Описание не указано</p>
              </v-col>
              <v-col cols="12" v-if="profile.role === 'nutri'">
                <h4 aria-label="Курсы">Курсы</h4>
                <v-list v-if="courses.length > 0" aria-label="Список курсов">
                  <v-list-item v-for="(course, index) in sortedCourses" :key="index" aria-label="Курс">
                    <v-list-item-title aria-label="Название курса">{{ course.title }} - {{ course.price }} руб.</v-list-item-title>
                    <v-list-item-subtitle aria-label="Описание курса">{{ course.description }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
                <p v-else aria-label="Курсов нет">Курсов нет</p>
              </v-col>
              <v-col cols="12">
                <h4 aria-label="Отзывы">Отзывы</h4>
                <v-list v-if="reviews.length > 0" aria-label="Список отзывов">
                  <v-list-item v-for="(review, index) in reviews" :key="index" aria-label="Отзыв">
                    <v-list-item-title aria-label="Содержание отзыва">{{ review.content }}</v-list-item-title>
                    <v-list-item-subtitle aria-label="Автор отзыва">— Пользователь #{{ review.author_id }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
                <p v-else aria-label="Отзывов нет">Отзывов нет</p>
              </v-col>
            </v-row>
            <v-btn 
              color="primary" 
              @click="openChat" 
              block 
              class="mt-4" 
              v-if="role === 'client' && isLoggedIn" 
              v-tooltip="'Связаться с нутрициологом'" 
              aria-label="Связаться"
            >
              Связаться
            </v-btn>
            <v-btn 
              v-else-if="!isLoggedIn" 
              to="/login" 
              block 
              class="mt-4" 
              v-tooltip="'Войти для связи'" 
              aria-label="Войти для связи"
            >
              Войти для связи
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogChat" max-width="500" aria-label="Диалог чата">
      <v-card height="400">
        <v-card-title aria-label="Чат с {{ selectedNutriName }}">Чат с {{ selectedNutriName }}</v-card-title>
        <v-card-text>
          <v-list class="overflow-y-auto" height="250" aria-label="Сообщения чата">
            <v-list-item 
              v-for="(msg, index) in chatMessages" 
              :key="index" 
              :class="msg.sender_id === userId ? 'text-right' : 'text-left'" 
              aria-label="Сообщение в чате"
            >
              <v-list-item-content>
                <v-list-item-title 
                  :class="msg.sender_id === userId ? 'bg-primary text-white pa-2 rounded' : 'bg-light text-dark pa-2 rounded'"
                  aria-label="Текст сообщения"
                >
                  {{ msg.content }}
                </v-list-item-title>
                <v-list-item-subtitle aria-label="Время сообщения">{{ msg.created_at }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-text-field 
            v-model="newMessage" 
            placeholder="Сообщение" 
            @input="newMessage = $event !== null ? $event : ''"
            @keyup.enter="sendChatMessage" 
            aria-label="Введите сообщение" 
          />
        </v-card-text>
        <v-card-actions>
          <v-btn 
            color="primary" 
            @click="sendChatMessage" 
            v-tooltip="'Отправить сообщение'" 
            aria-label="Отправить сообщение"
          >
            Отправить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import { useRoute, useRouter } from 'vue-router'
import { useNuxtApp } from 'nuxt/app'

const { $emitter } = useNuxtApp()
const emitter = $emitter
const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const userIdParam = ref(route.params.id ? parseInt(route.params.id) : null)
const profile = ref({})
const courses = ref([])
const reviews = ref([])
const token = ref(null)
const role = ref('')
const userId = ref(null)
const isLoggedIn = ref(false)
const errorMessage = ref('')
const dialogChat = ref(false)
const chatMessages = ref([])
const newMessage = ref('')
const selectedNutriName = ref('')
const ws = ref(null)

const sortedCourses = computed(() => {
  return [...courses.value].sort((a, b) => a.title.localeCompare(b.title) || a.id - b.id)
})

onMounted(async () => {
  if (process.client) {
    token.value = localStorage.getItem('token')
    role.value = localStorage.getItem('role') || ''
    userId.value = localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')) : null
    isLoggedIn.value = !!token.value
  }
  await loadProfile()
  if (isLoggedIn.value) {
    connectWebSocket()
    emitter.on('message', handleNewMessage)
  }
})

onUnmounted(() => {
  if (ws.value) ws.value.close()
  emitter.off('message', handleNewMessage)
})

const loadProfile = async () => {
  const headers = token.value ? { Authorization: `Bearer ${token.value}` } : {}
  const { data, error } = await useFetch(`${config.public.apiBase}/api/profile/${userIdParam.value}`, { headers })
  if (error.value) {
    errorMessage.value = 'Ошибка загрузки профиля: ' + (error.value.data?.error || 'Неизвестная ошибка')
    return
  }
  profile.value = data.value.profile || {}
  courses.value = data.value.courses || []
  const { data: reviewData, error: reviewError } = await useFetch(`${config.public.apiBase}/api/reviews/user/${userIdParam.value}`, { headers })
  if (reviewError.value) {
    errorMessage.value += ' Ошибка загрузки отзывов: ' + (reviewError.value.data?.error || 'Неизвестная ошибка')
  }
  reviews.value = reviewData.value || []
}

const openChat = async () => {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }
  selectedNutriName.value = profile.value.full_name || profile.value.username
  await loadChatMessages()
  dialogChat.value = true
}

const loadChatMessages = async () => {
  const headers = { Authorization: `Bearer ${token.value}` }
  const { data, error } = await useFetch(`${config.public.apiBase}/api/messages?receiver_id=${userIdParam.value}`, { headers })
  if (!error.value) {
    chatMessages.value = data.value || []
    await markRead()
  }
}

const sendChatMessage = async () => {
  if (!newMessage.value) return
  const headers = { Authorization: `Bearer ${token.value}` }
  const body = { receiver_id: userIdParam.value, content: newMessage.value }
  const { data, error } = await useFetch(`${config.public.apiBase}/api/messages`, { method: 'POST', headers, body })
  if (!error.value) {
    chatMessages.value.push(data.value)
    newMessage.value = ''
    emitter.emit('message', data.value)
  }
}

const markRead = async () => {
  const headers = { Authorization: `Bearer ${token.value}` }
  await useFetch(`${config.public.apiBase}/api/messages/read?receiver_id=${userIdParam.value}`, { method: 'PUT', headers })
}

const handleNewMessage = (msg) => {
  if (dialogChat.value && (msg.sender_id === userIdParam.value || msg.receiver_id === userIdParam.value)) {
    chatMessages.value.push(msg)
    markRead()
  }
}

const connectWebSocket = () => {
  if (!token.value || !process.client) return
  try {
    ws.value = new WebSocket(`${config.public.wsBase}/ws?token=${token.value}`)
    ws.value.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'message') {
        handleNewMessage(data.data)
      }
    }
    ws.value.onclose = () => {
      setTimeout(connectWebSocket, 5000)
    }
  } catch (e) {
    console.error('WebSocket error:', e)
  }
}
</script>