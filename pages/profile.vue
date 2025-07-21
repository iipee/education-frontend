<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-6">
          <v-card-title class="justify-center">
            <h2>Профиль</h2>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <h3>{{ profile.username }}</h3>
                <p>{{ profile.description }}</p>
              </v-col>
              <v-col cols="12">
                <h4>Услуги</h4>
                <v-list>
                  <v-list-item v-for="(service, index) in profile.services" :key="index">
                    <v-list-item-content>
                      <v-list-item-title>{{ service }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12">
                <h4>Отзывы</h4>
                <v-list>
                  <v-list-item v-for="(review, index) in reviews" :key="index">
                    <v-list-item-content>
                      <v-list-item-title>{{ review.text }}</v-list-item-title>
                      <v-list-item-subtitle>— Пользователь #{{ review.author_id }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12">
                <h4>Заказы</h4>
                <v-list>
                  <v-list-item v-for="(order, index) in orders" :key="index">
                    <v-list-item-content>
                      <v-list-item-title>Заказ #{{ order.id }} - Статус: {{ order.status }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
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
const token = localStorage.getItem('token')
const role = localStorage.getItem('role')

onMounted(async () => {
  const { data } = await useFetch(`${config.public.apiBase}/api/profile`, {
    headers: { Authorization: token }
  })
  profile.value = data.value

  // Reviews (for user's courses; adjust course_id as 0 for example)
  const { data: reviewData } = await useFetch(`${config.public.apiBase}/api/reviews/0`, { headers: { Authorization: token } })
  reviews.value = reviewData.value

  const { data: orderData } = await useFetch(`${config.public.apiBase}/api/orders`, { headers: { Authorization: token } })
  orders.value = orderData.value
})
</script>