<template>
  <v-container fluid>
    <v-parallax :src="`/images/salad.jpg`" height="60vh">
      <v-row align="center" justify="center">
        <v-col class="text-center">
          <h1 class="text-h3 font-weight-bold" style="color: #2E7D32;" aria-label="Слоган платформы">
            Откройте персонализированное питание
          </h1>
          <p class="text-h5 mt-4" aria-label="Подзаголовок">Найдите идеального нутрициолога для вашего здоровья</p>
          <v-btn
            color="primary"
            large
            to="/search"
            class="mt-6"
            v-tooltip="'Перейти к поиску курсов'"
            aria-label="Поиск курсов"
          >
            Поиск курсов
          </v-btn>
        </v-col>
      </v-row>
    </v-parallax>
    <v-container>
      <v-row class="mt-12">
        <v-col cols="12">
          <h2 class="text-h4 text-center mb-8" aria-label="Рекомендуемые нутрициологи">Рекомендуемые нутрициологи</h2>
          <v-row>
            <v-col v-if="loading" v-for="n in 3" :key="n" cols="12" sm="6" md="4">
              <v-skeleton-loader type="card" aria-label="Загрузка карточки" />
            </v-col>
            <v-col v-else-if="recommended.length === 0" cols="12">
              <p class="text-center" aria-label="Нет рекомендаций">Нет доступных нутрициологов</p>
            </v-col>
            <v-col v-else v-for="(nutri, index) in recommended" :key="index" cols="12" sm="6" md="4">
              <v-card height="400" class="pa-4 d-flex flex-column" aria-label="Карточка нутрициолога">
                <v-img
                  src="/images/nutri-placeholder.jpg"
                  height="200"
                  class="rounded-circle mx-auto"
                  aria-label="Фото нутрициолога"
                />
                <v-card-title class="justify-center" aria-label="Имя нутрициолога">{{ nutri.full_name || 'Не указано' }}</v-card-title>
                <v-card-text class="flex-grow-1" style="min-height: 100px;" aria-label="Описание нутрициолога">
                  {{ nutri.description ? nutri.description.slice(0, 100) + '...' : 'Описание не указано' }}
                </v-card-text>
                <v-card-actions class="justify-center">
                  <v-btn
                    color="primary"
                    :to="`/profile/${nutri.id}`"
                    v-tooltip="'Просмотреть профиль'"
                    aria-label="Просмотреть профиль"
                  >
                    Просмотреть
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="mt-12">
        <v-col cols="12">
          <h2 class="text-h4 text-center mb-8" aria-label="Отзывы">Отзывы</h2>
          <v-carousel height="300" hide-delimiter-background show-arrows-on-hover>
            <v-carousel-item v-for="(review, index) in reviews" :key="index" aria-label="Отзыв">
              <v-sheet height="100%" tile>
                <v-row class="fill-height" align="center" justify="center">
                  <v-col cols="8">
                    <p class="text-center text-h6" aria-label="Содержание отзыва">"{{ review.content }}"</p>
                    <p class="text-center mt-4" aria-label="Автор отзыва">- Пользователь #{{ review.author_id }}</p>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
        </v-col>
      </v-row>
      <v-snackbar v-model="snackbar" color="error" timeout="3000" aria-label="Уведомление об ошибке">
        {{ errorMessage }}
      </v-snackbar>
    </v-container>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import { nextTick } from 'vue'

const config = useRuntimeConfig()
const recommended = ref([])
const reviews = ref([])
const loading = ref(true)
const snackbar = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  try {
    const { data } = await useFetch(`${config.public.apiBase}/api/nutris?limit=4&random=true`)
    console.log('API response:', data)
    recommended.value = data.value || []
    if (!recommended.value.length) {
      console.warn('No nutris returned from API')
    }
    const { data: reviewData } = await useFetch(`${config.public.apiBase}/api/reviews/random`)
    reviews.value = reviewData.value || []
  } catch (error) {
    errorMessage.value = 'Ошибка загрузки данных: ' + (error.message || 'Неизвестная ошибка')
    snackbar.value = true
    console.error('Fetch error:', error)
  } finally {
    loading.value = false
  }
})

watch(recommended, () => {
  nextTick(() => {
    loading.value = false
  })
})

definePageMeta({
  layout: 'default'
})
</script>