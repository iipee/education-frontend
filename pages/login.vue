<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-6">
          <v-card-title class="justify-center">
            <h2>Вход</h2>
          </v-card-title>
          <v-card-text>
            <v-form v-model="valid" @submit.prevent="login">
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
              <v-btn
                color="primary"
                type="submit"
                :disabled="!valid"
                block
                class="mt-4"
              >
                Войти
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    login() {
      console.log('Вход:', this.form)
      // Пример: this.$axios.post('/api/login', this.form).then(response => { ... })
    }
  }
}
</script>