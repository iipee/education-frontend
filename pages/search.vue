<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-text-field
          v-model="searchQuery"
          label="Поиск нутрициолога или услуги"
          prepend-icon="mdi-magnify"
          clearable
          @input="search"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="(nutritionist, index) in nutritionists" :key="index" cols="12" sm="6" md="4">
        <v-card class="pa-4">
          <v-card-title>{{ nutritionist.username }}</v-card-title>
          <v-card-text>{{ nutritionist.description }}</v-card-text>
          <v-card-actions>
            <v-btn color="primary" :to="`/profile/${nutritionist.id}`">Посмотреть профиль</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'

const config = useRuntimeConfig()
const searchQuery = ref('')
const nutritionists = ref([])
const token = localStorage.getItem('token')

const search = async () => {
  const { data } = await useFetch(`${config.public.apiBase}/api/search?q=${searchQuery.value}`, {
    headers: { Authorization: token }
  })
  nutritionists.value = data.value
}
</script>