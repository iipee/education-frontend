<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6">
        <v-form @submit.prevent="updateCourse">
          <v-text-field v-model="form.title" label="Название курса" required></v-text-field>
          <v-textarea v-model="form.description" label="Описание" required></v-textarea>
          <v-text-field v-model="form.video_url" label="URL видео" required></v-text-field>
          <v-text-field v-model="form.price" label="Стоимость" type="number" required></v-text-field>
          <v-btn type="submit" color="primary">Обновить курс</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRuntimeConfig } from 'nuxt/app'

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const form = ref({
  title: '',
  description: '',
  video_url: '',
  price: 0
})
const token = localStorage.getItem('token')

onMounted(async () => {
  const { data } = await useFetch(`${config.public.apiBase}/api/courses/${route.params.id}`, {
    headers: { Authorization: token }
  })
  form.value = data.value
})

const updateCourse = async () => {
  const { error } = await useFetch(`${config.public.apiBase}/api/courses/${route.params.id}`, {
    method: 'PUT',
    headers: { Authorization: token },
    body: form.value
  })
  if (error.value) {
    console.error('Update error:', error.value)
    return
  }
  router.push('/profile')
}
</script>