<template>
  <v-container>
    <v-row justify="center" class="text-center mb-6">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">Найдите своего нутрициолога</h1>
        <v-text-field
          v-model="searchQuery"
          label="Введите имя или услугу"
          prepend-icon="mdi-magnify"
          clearable
          @input="search"
        />
        <v-btn color="primary" @click="search" block class="mt-4">Поиск</v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="6">
        <v-card class="pa-4 glassmorphism" elevation="2">
          <v-card-title class="justify-center">
            Станьте нутрициологом
          </v-card-title>
          <v-card-actions>
            <v-btn color="secondary" to="/register" block>Зарегистрироваться как эксперт</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRuntimeConfig } from 'nuxt/app'

const config = useRuntimeConfig()
const router = useRouter()
const searchQuery = ref('')

const search = () => {
  if (searchQuery.value) {
    router.push(`/search?q=${searchQuery.value}`)
  }
}
</script>