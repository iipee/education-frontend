<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-6" aria-label="Заказ услуги">
          <v-card-title class="justify-center">
            <h2 aria-label="Заказ услуги">Заказ услуги</h2>
          </v-card-title>
          <v-card-text>
            <v-alert v-if="errorMessage" type="error" dismissible class="mb-4" aria-label="Сообщение об ошибке">
              {{ errorMessage }}
            </v-alert>
            <v-list v-if="courses.length > 0" aria-label="Список доступных курсов">
              <v-list-item v-for="(course, index) in courses" :key="index" aria-label="Курс">
                <v-list-item-content>
                  <v-list-item-title aria-label="Название курса">{{ course.title }} - {{ course.price }} руб.</v-list-item-title>
                  <v-list-item-subtitle aria-label="Описание курса">{{ course.description }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn 
                    color="primary" 
                    @click="orderCourse(course)" 
                    v-tooltip="'Заказать курс'" 
                    aria-label="Заказать курс"
                  >
                    Заказать
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <p v-else aria-label="Нет доступных услуг">Нет доступных услуг</p>
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
const token = ref(null)
const errorMessage = ref('')

onMounted(async () => {
  if (process.client) {
    token.value = localStorage.getItem('token')
  }
  if (!token.value) {
    errorMessage.value = 'Требуется авторизация'
    router.push('/login')
    return
  }
  const { data, error } = await useFetch(`${config.public.apiBase}/api/courses`, {
    headers: { Authorization: `Bearer ${token.value}` }
  })
  if (error.value) {
    errorMessage.value = 'Ошибка загрузки услуг: ' + (error.value.data?.error || 'Неизвестная ошибка')
    return
  }
  courses.value = data.value || []
})

const orderCourse = async (course) => {
  if (!token.value) return
  const headers = { Authorization: `Bearer ${token.value}` }
  const body = { course_id: course.id }
  const { data, error } = await useFetch(`${config.public.apiBase}/api/payments/simulate`, {
    method: 'POST',
    headers,
    body
  })
  if (error.value) {
    errorMessage.value = 'Ошибка заказа: ' + (error.value.data?.error || 'Неизвестная ошибка')
    return
  }
  router.push(`/courses/${course.id}`)
}
</script>