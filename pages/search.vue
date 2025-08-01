<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <v-text-field
          v-model="searchQuery"
          label="Поиск курсов или услуг"
          prepend-icon="mdi-magnify"
          clearable
          :style="searchFieldStyle"
          @input="debouncedSearch"
          aria-label="Поле для поиска курсов или услуг"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="loading" v-for="n in 6" :key="n" cols="12" sm="6" md="4">
        <v-skeleton-loader type="card" aria-label="Загрузка карточки" />
      </v-col>
      <v-col v-else v-for="(course, index) in courses" :key="index" cols="12" sm="6" md="4">
        <v-card class="pa-4" height="450" aria-label="Карточка курса">
          <v-card-title aria-label="Название курса">{{ course.title }}</v-card-title>
          <v-card-subtitle aria-label="Автор курса">Автор: {{ course.teacher ? course.teacher.full_name : 'Не указан' }}</v-card-subtitle>
          <v-card-text>
            <ul v-if="course.services" aria-label="Список услуг">
              <li v-for="(service, i) in course.services" :key="i">{{ service }}</li>
            </ul>
            <p aria-label="Описание курса">{{ course.description.slice(0, 150) }}...</p>
            <p aria-label="Цена курса">Цена: {{ course.price }} руб.</p>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              :to="`/courses/${course.id}`"
              v-tooltip="'Просмотреть детали курса'"
              aria-label="Просмотреть детали"
            >
              Детали
            </v-btn>
            <v-btn
              v-if="isLoggedIn"
              color="success"
              @click="enroll(course.id)"
              v-tooltip="'Записаться на курс'"
              aria-label="Записаться"
            >
              Записаться
            </v-btn>
            <v-btn
              v-if="isLoggedIn"
              outlined
              color="primary"
              @click="openChat(course.teacher_id)"
              v-tooltip="'Связаться с автором'"
              aria-label="Связаться"
            >
              Связаться
            </v-btn>
            <v-btn
              v-else
              to="/login"
              v-tooltip="'Войти для действий'"
              aria-label="Войти"
            >
              Войти
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" v-if="!loading && courses.length === 0">
        <p aria-label="Нет результатов поиска">Нет результатов</p>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" color="error" timeout="3000" aria-label="Уведомление об ошибке">
      {{ errorMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import { debounce } from 'lodash'
import { useRouter } from 'vue-router'

const config = useRuntimeConfig()
const router = useRouter()
const searchQuery = ref('')
const courses = ref([])
const token = ref(null)
const isLoggedIn = ref(false)
const loading = ref(true)
const snackbar = ref(false)
const errorMessage = ref('')

onMounted(() => {
  if (process.client) {
    token.value = localStorage.getItem('token')
    isLoggedIn.value = !!token.value
  }
  search()
})

const search = async () => {
  loading.value = true
  const headers = token.value ? { Authorization: `Bearer ${token.value}` } : {}
  const query = searchQuery.value.trim()
  const { data, error } = await useFetch(`${config.public.apiBase}/api/search?q=${encodeURIComponent(query)}`, { headers })
  if (error.value) {
    console.error('Ошибка поиска:', error.value)
    courses.value = []
    errorMessage.value = 'Ошибка поиска: ' + (error.value.data?.error || 'Неизвестная ошибка')
    snackbar.value = true
    return
  }
  courses.value = data.value || []
  loading.value = false
}

const debouncedSearch = debounce(search, 300)

watch(searchQuery, (newVal) => {
  if (newVal === '') {
    search() // Выполнить поиск сразу, если строка пустая
  } else {
    debouncedSearch()
  }
})

const enroll = (id) => {
  router.push(`/courses/${id}`)
}

const openChat = (teacherId) => {
  router.push(`/profile/${teacherId}`)
}
</script>

<style scoped>
:deep(.v-text-field input::placeholder) {
  color: #6C757D !important;
}
:deep(.v-text-field .v-icon) {
  color: #28A745 !important;
}
</style>