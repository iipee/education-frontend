<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-skeleton-loader v-if="courseStore.loading" type="card" aria-label="Загрузка карточки" />
        <v-card v-else class="pa-6" elevation="2" style="border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" aria-label="Детали курса">
          <v-card-title class="justify-center">
            <h2 aria-label="Название курса">{{ courseStore.course.title || 'Курс' }}</h2>
          </v-card-title>
          <v-card-text>
            <v-avatar size="100" class="mb-4">
              <v-img 
                src="/images/nutri-placeholder.jpg" 
                aria-label="Фото автора"
              >
                <template v-slot:placeholder>
                  <v-icon size="100" color="#CED4DA">mdi-account-circle</v-icon>
                </template>
              </v-img>
            </v-avatar>
            <p aria-label="Автор курса">Автор: <NuxtLink :to="`/profile/${courseStore.course.teacher_id}`" aria-label="Ссылка на профиль автора">{{ courseStore.course.teacher?.full_name }}</NuxtLink></p>
            <p aria-label="Описание курса">Описание: {{ courseStore.course.description || 'Описание не указано' }}</p>
            <p aria-label="Услуги">Услуги: {{ courseStore.course.services?.join(', ') }}</p>
            <p aria-label="Стоимость">Стоимость: {{ courseStore.course.price }} руб.</p>
            <p v-if="courseStore.course.video_url" aria-label="Видео">Видео: <a :href="courseStore.course.video_url" aria-label="Ссылка на видео">Ссылка</a></p>
            <v-btn color="primary" @click="openPayment" v-if="isLoggedIn && !courseStore.isPaid" v-tooltip="'Записаться на курс'" aria-label="Записаться">Записаться</v-btn>
            <v-btn outlined color="primary" @click="openChat" v-if="isLoggedIn" v-tooltip="'Связаться с автором'" aria-label="Связаться">Связаться</v-btn>
            <v-btn text to="/login" v-else v-tooltip="'Войти для действий'" aria-label="Войти">Войти для действий</v-btn>
            <v-divider class="my-4" />
            <h3 aria-label="Отзывы">Отзывы</h3>
            <v-list aria-label="Список отзывов">
              <v-list-item v-for="(review, index) in courseStore.reviews" :key="index" aria-label="Отзыв">
                <v-list-item-content>
                  <v-list-item-title aria-label="Содержание отзыва">{{ review.content }}</v-list-item-title>
                  <v-list-item-subtitle aria-label="Автор отзыва">Автор #{{ review.author_id }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-btn color="secondary" @click="openReviewModal" v-if="courseStore.canReview" v-tooltip="'Оставить отзыв'" aria-label="Оставить отзыв">Оставить отзыв</v-btn>
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
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import { useRoute, useRouter } from 'vue-router'
import { useNuxtApp } from 'nuxt/app'
import { useCourseStore } from '~/stores/course'

const { $emitter } = useNuxtApp()
const emitter = $emitter
const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()
const token = ref(null)
const userId = ref(null)
const isLoggedIn = ref(false)
const dialogPayment = ref(false)
const dialogReview = ref(false)
const cardNum = ref('')
const expiry = ref('')
const cvv = ref('')
const reviewText = ref('')
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

onMounted(async () => {
  if (process.client) {
    token.value = localStorage.getItem('token')
    userId.value = localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')) : null
    isLoggedIn.value = !!token.value
  }
  await courseStore.loadCourse(route.params.id)
  if (isLoggedIn.value) {
    await courseStore.checkCanReview(userId.value)
    emitter.on('message', courseStore.handleNewMessage)
  }
})

onUnmounted(() => {
  emitter.off('message', courseStore.handleNewMessage)
})

watch(() => route.params.id, async (newId) => {
  await courseStore.loadCourse(newId)
})

const goBack = () => {
  router.back()
}

const openPayment = () => {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }
  dialogPayment.value = true
}

const submitPayment = async () => {
  if (!cardNum.value || !expiry.value || !cvv.value) {
    snackbarText.value = 'Заполните все поля'
    snackbarColor.value = 'error'
    snackbar.value = true
    return
  }
  try {
    await courseStore.submitPayment(route.params.id, userId.value)
    snackbarText.value = `Оплата успешна! ID: ${courseStore.transactionId}`
    snackbarColor.value = 'success'
    snackbar.value = true
    await courseStore.loadCourse(route.params.id)
  } catch (error) {
    snackbarText.value = 'Ошибка оплаты: ' + (error.message || 'Неизвестная ошибка')
    snackbarColor.value = 'error'
    snackbar.value = true
  } finally {
    dialogPayment.value = false
  }
}

const openChat = async () => {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }
  try {
    const headers = { Authorization: `Bearer ${token.value}` }
    const { data } = await $fetch(`${config.public.apiBase}/api/start-chat`, {
      method: 'POST',
      headers,
      body: { receiver_id: courseStore.course.teacher_id }
    })
    router.push(`/chats?selected=${data.receiver_id}`)
  } catch (error) {
    snackbarText.value = 'Ошибка открытия чата: ' + (error.message || 'Неизвестная ошибка')
    snackbarColor.value = 'error'
    snackbar.value = true
  }
}

const openReviewModal = () => {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }
  dialogReview.value = true
}

const submitReview = async () => {
  if (!reviewText.value) {
    snackbarText.value = 'Отзыв обязателен'
    snackbarColor.value = 'error'
    snackbar.value = true
    return
  }
  try {
    await courseStore.submitReview(route.params.id, reviewText.value, userId.value)
    snackbarText.value = 'Отзыв отправлен'
    snackbarColor.value = 'success'
    snackbar.value = true
    dialogReview.value = false
    reviewText.value = ''
  } catch (error) {
    snackbarText.value = 'Ошибка отправки отзыва: ' + (error.message || 'Неизвестная ошибка')
    snackbarColor.value = 'error'
    snackbar.value = true
  }
}
</script>