<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-6" aria-label="Детали курса">
          <v-card-title class="justify-center">
            <h2 aria-label="Название курса">{{ course.title || 'Курс' }}</h2>
          </v-card-title>
          <v-card-text>
            <p aria-label="Автор курса">Автор: <NuxtLink :to="`/profile/${course.teacher_id}`" aria-label="Ссылка на профиль автора">{{ course.teacher.full_name }}</NuxtLink></p>
            <p aria-label="Описание курса">Описание: {{ course.description || 'Описание не указано' }}</p>
            <p aria-label="Услуги">Услуги: {{ course.services.join(', ') }}</p>
            <p aria-label="Стоимость">Стоимость: {{ course.price }} руб.</p>
            <p v-if="course.video_url" aria-label="Видео">Видео: <a :href="course.video_url" aria-label="Ссылка на видео">Ссылка</a></p>
            <v-btn color="primary" @click="openPayment" v-if="isLoggedIn && !isPaid" v-tooltip="'Записаться на курс'" aria-label="Записаться">Записаться</v-btn>
            <v-btn outlined color="primary" @click="openChat" v-if="isLoggedIn" v-tooltip="'Связаться с автором'" aria-label="Связаться">Связаться</v-btn>
            <v-btn text to="/login" v-else v-tooltip="'Войти для действий'" aria-label="Войти">Войти для действий</v-btn>
            <v-divider class="my-4" />
            <h3 aria-label="Отзывы">Отзывы</h3>
            <v-list aria-label="Список отзывов">
              <v-list-item v-for="(review, index) in reviews" :key="index" aria-label="Отзыв">
                <v-list-item-content>
                  <v-list-item-title aria-label="Содержание отзыва">{{ review.content }}</v-list-item-title>
                  <v-list-item-subtitle aria-label="Автор отзыва">Автор #{{ review.author_id }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-btn color="secondary" @click="openReviewModal" v-if="canReview" v-tooltip="'Оставить отзыв'" aria-label="Оставить отзыв">Оставить отзыв</v-btn>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="goBack" v-tooltip="'Вернуться назад'" aria-label="Вернуться">Вернуться</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogPayment" max-width="400" aria-label="Диалог оплаты">
      <v-card>
        <v-card-title aria-label="Оплата">Оплата</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field label="Номер карты" v-model="cardNum" :rules="[v => !!v || 'Поле обязательно']" aria-label="Номер карты" />
            <v-text-field label="Срок действия" v-model="expiry" :rules="[v => !!v || 'Поле обязательно']" aria-label="Срок действия" />
            <v-text-field label="CVV" v-model="cvv" type="password" :rules="[v => !!v || 'Поле обязательно']" aria-label="CVV" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="submitPayment" v-tooltip="'Подтвердить оплату'" aria-label="Подтвердить оплату">Оплатить</v-btn>
          <v-btn text @click="dialogPayment = false" aria-label="Отмена">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogChat" max-width="500" aria-label="Диалог чата">
      <v-card height="400">
        <v-card-title aria-label="Чат с {{ selectedNutriName }}">Чат с {{ selectedNutriName }}</v-card-title>
        <v-card-text>
          <v-list aria-label="Сообщения чата" class="overflow-y-auto" height="250">
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
            @keyup.enter="sendChatMessage" 
            aria-label="Введите сообщение" 
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="sendChatMessage" v-tooltip="'Отправить сообщение'" aria-label="Отправить сообщение">Отправить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogReview" max-width="400" aria-label="Диалог отзыва">
      <v-card>
        <v-card-title aria-label="Оставить отзыв">Оставить отзыв</v-card-title>
        <v-card-text>
          <v-textarea 
            v-model="reviewText" 
            label="Ваш отзыв" 
            :rules="[v => !!v || 'Отзыв обязателен']" 
            aria-label="Ваш отзыв" 
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="submitReview" v-tooltip="'Отправить отзыв'" aria-label="Отправить отзыв">Отправить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" aria-label="Уведомление о результате">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import { useRoute, useRouter } from 'vue-router'
import { inject } from 'vue'

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const emitter = inject('emitter')
const course = ref({})
const reviews = ref([])
const token = ref(null)
const userId = ref(null)
const isLoggedIn = ref(false)
const isPaid = ref(false)
const canReview = ref(false)
const dialogPayment = ref(false)
const dialogChat = ref(false)
const dialogReview = ref(false)
const cardNum = ref('')
const expiry = ref('')
const cvv = ref('')
const reviewText = ref('')
const chatMessages = ref([])
const newMessage = ref('')
const selectedNutri = ref(null)
const selectedNutriName = ref('')
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
const ws = ref(null)

onMounted(async () => {
  if (process.client) {
    token.value = localStorage.getItem('token')
    userId.value = parseInt(localStorage.getItem('userId'))
    isLoggedIn.value = !!token.value
  }
  await loadCourse()
  await loadReviews()
  if (isLoggedIn.value) {
    await checkCanReview()
  }
  connectWebSocket()
  emitter.on('message', handleNewMessage)
})

onUnmounted(() => {
  if (ws.value) ws.value.close()
  emitter.off('message', handleNewMessage)
})

const loadCourse = async () => {
  const headers = token.value ? { Authorization: `Bearer ${token.value}` } : {}
  const { data, error } = await useFetch(`${config.public.apiBase}/api/courses/${route.params.id}`, { headers })
  if (error.value) {
    snackbarText.value = 'Ошибка загрузки курса: ' + (error.value.data?.error || 'Неизвестная ошибка')
    snackbarColor.value = 'error'
    snackbar.value = true
    return
  }
  course.value = data.value || {}
}

const loadReviews = async () => {
  const headers = token.value ? { Authorization: `Bearer ${token.value}` } : {}
  const { data, error } = await useFetch(`${config.public.apiBase}/api/reviews/course/${route.params.id}`, { headers })
  if (error.value) {
    snackbarText.value = 'Ошибка загрузки отзывов: ' + (error.value.data?.error || 'Неизвестная ошибка')
    snackbarColor.value = 'error'
    snackbar.value = true
  }
  reviews.value = data.value || []
}

const checkCanReview = async () => {
  const headers = { Authorization: `Bearer ${token.value}` }
  const { data, error } = await useFetch(`${config.public.apiBase}/api/payments`, { headers })
  if (error.value) {
    snackbarText.value = 'Ошибка проверки платежей: ' + (error.value.data?.error || 'Неизвестная ошибка')
    snackbarColor.value = 'error'
    snackbar.value = true
    return
  }
  isPaid.value = data.value.some(p => p.course_id === parseInt(route.params.id) && p.status === 'success')
  canReview.value = isPaid.value
}

const goBack = () => {
  router.back()
}

const openPayment = () => {
  dialogPayment.value = true
}

const submitPayment = async () => {
  if (!cardNum.value || !expiry.value || !cvv.value) {
    snackbarText.value = 'Заполните все поля'
    snackbarColor.value = 'error'
    snackbar.value = true
    return
  }
  const headers = { Authorization: `Bearer ${token.value}` }
  const body = { course_id: parseInt(route.params.id) }
  const { data, error } = await useFetch(`${config.public.apiBase}/api/payments/simulate`, { method: 'POST', headers, body })
  dialogPayment.value = false
  if (!error.value) {
    snackbarText.value = `Оплата успешна! ID: ${data.value.transaction_id}`
    snackbarColor.value = 'success'
    snackbar.value = true
    canReview.value = true
    isPaid.value = true
  } else {
    snackbarText.value = 'Ошибка оплаты: ' + (error.value.data?.error || 'Неизвестная ошибка')
    snackbarColor.value = 'error'
    snackbar.value = true
  }
}

const openChat = async () => {
  selectedNutri.value = course.value.teacher_id
  selectedNutriName.value = course.value.teacher.full_name
  await loadChatMessages()
  dialogChat.value = true
}

const loadChatMessages = async () => {
  const headers = { Authorization: `Bearer ${token.value}` }
  const { data, error } = await useFetch(`${config.public.apiBase}/api/messages?receiver_id=${selectedNutri.value}`, { headers })
  if (!error.value) {
    chatMessages.value = data.value || []
    await markRead()
  }
}

const sendChatMessage = async () => {
  if (!newMessage.value) return
  const headers = { Authorization: `Bearer ${token.value}` }
  const body = { receiver_id: selectedNutri.value, content: newMessage.value }
  const { data, error } = await useFetch(`${config.public.apiBase}/api/messages`, { method: 'POST', headers, body })
  if (!error.value) {
    chatMessages.value.push(data.value)
    newMessage.value = ''
    emitter.emit('message', data.value)
  }
}

const markRead = async () => {
  const headers = { Authorization: `Bearer ${token.value}` }
  await useFetch(`${config.public.apiBase}/api/messages/read?receiver_id=${selectedNutri.value}`, { method: 'PUT', headers })
}

const handleNewMessage = (msg) => {
  if (dialogChat.value && (msg.sender_id === selectedNutri.value || msg.receiver_id === selectedNutri.value)) {
    chatMessages.value.push(msg)
    markRead()
  }
}

const openReviewModal = () => {
  dialogReview.value = true
}

const submitReview = async () => {
  if (!reviewText.value) {
    snackbarText.value = 'Отзыв обязателен'
    snackbarColor.value = 'error'
    snackbar.value = true
    return
  }
  const headers = { Authorization: `Bearer ${token.value}` }
  const body = { course_id: parseInt(route.params.id), content: reviewText.value }
  const { data, error } = await useFetch(`${config.public.apiBase}/api/reviews`, { method: 'POST', headers, body })
  if (!error.value) {
    reviews.value.push(data.value)
    dialogReview.value = false
    reviewText.value = ''
    snackbarText.value = 'Отзыв отправлен'
    snackbarColor.value = 'success'
    snackbar.value = true
  } else {
    snackbarText.value = 'Ошибка отправки отзыва: ' + (error.value.data?.error || 'Неизвестная ошибка')
    snackbarColor.value = 'error'
    snackbar.value = true
  }
}

const connectWebSocket = () => {
  if (!token.value) return
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
}
</script>