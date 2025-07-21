<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-6">
          <v-card-title class="justify-center">
            <h2>Заказ услуги</h2>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="(course, index) in courses" :key="index">
                <v-list-item-content>
                  <v-list-item-title>{{ course.title }} - {{ course.price }} руб.</v-list-item-title>
                  <v-list-item-subtitle>{{ course.description }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn color="primary" @click="orderCourse(course)">Заказать</v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import { useRouter } from 'vue-router'

const config = useRuntimeConfig()
const router = useRouter()
const courses = ref([])
const token = localStorage.getItem('token')

onMounted(async () => {
  const { data } = await useFetch(`${config.public.apiBase}/api/courses`, {
    headers: { Authorization: token }
  })
  courses.value = data.value
})

const orderCourse = async (course) => {
  const { data } = await useFetch(`${config.public.apiBase}/api/orders`, {
    method: 'POST',
    headers: { Authorization: token },
    body: {
      nutritionist_id: course.teacher_id,
      course_id: course.id,
      price: course.price
    }
  })
  // Симуляция оплаты
  console.log("Тест оплаты прошел успешно для заказа", data.value.id, "на сумму", course.price)
  router.push('/profile') // Перенаправление после "оплаты"
}
</script>