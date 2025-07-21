<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-6">
          <v-card-title class="justify-center">
            <h2>Профиль</h2>
          </v-card-title>
          <v-card-text>
            <v-alert v-if="errorMessage" type="error" dismissible class="mb-4">
              {{ errorMessage }}
            </v-alert>
            <v-row>
              <v-col cols="12">
                <h3>{{ profile.username || 'Имя не указано' }}</h3>
                <p v-if="profile.description">{{ profile.description }}</p>
                <p v-else>Описание не указано</p>
              </v-col>
              <v-col cols="12">
                <h4>Услуги</h4>
                <v-list v-if="profile.services && profile.services.length > 0">
                  <v-list-item v-for="(service, index) in profile.services" :key="index">
                    <v-list-item-content>
                      <v-list-item-title>{{ service }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <p v-else>Услуги не указаны</p>
              </v-col>
              <v-col cols="12">
                <h4>Отзывы</h4>
                <v-list v-if="reviews.length > 0">
                  <v-list-item v-for="(review, index) in reviews" :key="index">
                    <v-list-item-content>
                      <v-list-item-title>{{ review.text }}</v-list-item-title>
                      <v-list-item-subtitle>— Пользователь #{{ review.author_id }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <p v-else>Отзывов нет</p>
              </v-col>
              <v-col cols="12">
                <h4>Заказы</h4>
                <v-list v-if="orders.length > 0">
                  <v-list-item v-for="(order, index) in orders" :key="index">
                    <v-list-item-content>
                      <v-list-item-title>Заказ #{{ order.id }} - Статус: {{ order.status }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <p v-else>Заказов нет</p>
              </v-col>
            </v-row>
            <v-btn color="primary" to="/order" block class="mt-4" v-if="role === 'client'">
              Заказать услугу
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'

const config = useRuntimeConfig()
const profile = ref({})
const reviews = ref([])
const orders = ref([])
const token = ref(null)
const role = ref('')
const errorMessage = ref('')

onMounted(async () => {
  if (process.client) {
    token.value = localStorage.getItem('token')
    role.value = localStorage.getItem('role') || ''
  }
  if (!token.value) {
    errorMessage.value = 'Токен не найден, пожалуйста войдите заново'
    return
  }
  const { data, error: profileError } = await useFetch(`${config.public.apiBase}/api/profile`, {
    headers: { Authorization: token.value }
  })
  if (profileError.value) {
    errorMessage.value = 'Ошибка загрузки профиля: ' + (profileError.value.data?.error || 'Неизвестная ошибка')
    return
  }
  profile.value = data.value || {}

  const { data: reviewData, error: reviewError } = await useFetch(`${config.public.apiBase}/api/reviews/0`, { headers: { Authorization: token.value } })
  if (reviewError.value) {
    errorMessage.value += ' Ошибка загрузки отзывов'
  }
  reviews.value = reviewData.value || []

  const { data: orderData, error: orderError } = await useFetch(`${config.public.apiBase}/api/orders`, { headers: { Authorization: token.value } })
  if (orderError.value) {
    errorMessage.value += ' Ошибка загрузки заказов'
  }
  orders.value = orderData.value || []
})
</script>