<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-6" aria-label="Форма регистрации">
          <v-card-title class="justify-center">
            <h2 aria-label="Регистрация">Регистрация</h2>
          </v-card-title>
          <v-card-text>
            <v-alert v-if="errorMessage" type="error" dismissible class="mb-4" aria-label="Сообщение об ошибке">
              {{ errorMessage }}
            </v-alert>
            <v-form v-model="valid" @submit.prevent="register">
              <v-text-field
                v-model="form.username"
                label="Имя пользователя"
                prepend-icon="mdi-account"
                :rules="[v => !!v || 'Имя обязательно']"
                required
                aria-label="Имя пользователя"
              />
              <v-text-field
                v-model="form.email"
                label="Email"
                prepend-icon="mdi-email"
                :rules="[v => !!v || 'Email обязателен', v => /.+@.+\..+/.test(v) || 'Некорректный email']"
                required
                aria-label="Email"
              />
              <v-text-field
                v-model="form.full_name"
                label="Полное имя"
                prepend-icon="mdi-account-details"
                :rules="[v => !!v || 'Полное имя обязательно']"
                required
                aria-label="Полное имя"
              />
              <v-text-field
                v-model="form.password"
                label="Пароль"
                prepend-icon="mdi-lock"
                type="password"
                :rules="[v => !!v || 'Пароль обязателен', v => v.length >= 6 || 'Минимум 6 символов']"
                required
                aria-label="Пароль"
              />
              <v-select
                v-model="form.role"
                :items="roles"
                label="Роль"
                prepend-icon="mdi-account-group"
                :rules="[v => !!v || 'Роль обязательна']"
                required
                aria-label="Роль"
              />
              <v-textarea
                v-if="form.role === 'nutri'"
                v-model="form.description"
                label="Описание услуг"
                prepend-icon="mdi-information"
                :rules="[v => !!v || 'Описание обязательно для нутрициолога']"
                required
                aria-label="Описание услуг"
              />
              <v-btn
                color="primary"
                type="submit"
                :disabled="!valid"
                block
                class="mt-4"
                v-tooltip="'Зарегистрироваться'"
                aria-label="Зарегистрироваться"
              >
                Зарегистрироваться
              </v-btn>
            </v-form>
            <p class="mt-4 text-center" aria-label="Ссылка на вход">Нет профиля? <NuxtLink to="/login">Войти</NuxtLink></p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRuntimeConfig } from 'nuxt/app'
import { useNuxtApp } from 'nuxt/app'

const { $emitter } = useNuxtApp()
const emitter = $emitter
const config = useRuntimeConfig()
const router = useRouter()
const valid = ref(false)
const errorMessage = ref('')
const form = ref({
  username: '',
  email: '',
  full_name: '',
  password: '',
  role: '',
  description: ''
})
const roles = [
  { value: 'client', title: 'Клиент' },
  { value: 'nutri', title: 'Нутрициолог' }
]

const register = async () => {
  const { data, error } = await useFetch(`${config.public.apiBase}/api/register`, {
    method: 'POST',
    body: form.value
  })
  if (error.value) {
    errorMessage.value = error.value.data?.error || 'Ошибка регистрации'
    return
  }
  if (process.client) {
    localStorage.setItem('token', data.value.token)
    localStorage.setItem('role', form.value.role)
    localStorage.setItem('userId', data.value.id)
    emitter.emit('login')
  }
  router.push('/profile')
}
</script>