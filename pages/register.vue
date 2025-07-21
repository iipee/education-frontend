<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-6">
          <v-card-title class="justify-center">
            <h2>Регистрация</h2>
          </v-card-title>
          <v-card-text>
            <v-form v-model="valid" @submit.prevent="register">
              <v-text-field
                v-model="form.username"
                label="Имя пользователя"
                prepend-icon="mdi-account"
                :rules="[v => !!v || 'Имя обязательно']"
                required
              />
              <v-text-field
                v-model="form.email"
                label="Email"
                prepend-icon="mdi-email"
                :rules="[v => !!v || 'Email обязателен', v => /.+@.+\..+/.test(v) || 'Некорректный email']"
                required
              />
              <v-text-field
                v-model="form.password"
                label="Пароль"
                prepend-icon="mdi-lock"
                type="password"
                :rules="[v => !!v || 'Пароль обязателен', v => v.length >= 6 || 'Пароль должен быть не менее 6 символов']"
                required
              />
              <v-select
                v-model="form.role"
                :items="roles"
                label="Роль"
                prepend-icon="mdi-account-group"
                :rules="[v => !!v || 'Роль обязательна']"
                required
              />
              <v-textarea
                v-if="form.role === 'nutritionist'"
                v-model="form.description"
                label="Описание услуг"
                prepend-icon="mdi-information"
                :rules="[v => !!v || 'Описание обязательно']"
              />
              <v-btn
                color="primary"
                type="submit"
                :disabled="!valid"
                block
                class="mt-4"
              >
                Зарегистрироваться
              </v-btn>
            </v-form>
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

const config = useRuntimeConfig()
const router = useRouter()
const valid = ref(false)
const form = ref({
  username: '',
  email: '',
  password: '',
  role: '',
  description: ''
})
const roles = [{value: 'client', title: 'Клиент'}, {value: 'nutritionist', title: 'Нутрициолог'}]

const register = async () => {
  const { data, error } = await useFetch(`${config.public.apiBase}/api/register`, {
    method: 'POST',
    body: form.value
  })
  if (error.value) {
    console.error('Registration error:', error.value)
    return
  }
  localStorage.setItem('token', data.value.token)
  localStorage.setItem('role', form.value.role)
  router.push('/profile')
}
</script>