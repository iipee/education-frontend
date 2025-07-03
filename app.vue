<template>
  <v-app>
      <v-app-bar app color="primary" dark>
          <v-toolbar-title>Образовательная платформа</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn v-if="!isAuthenticated" to="/register" text @click="handleRegisterClick">Регистрация</v-btn>
          <v-btn v-if="isAuthenticated" @click="logout" text>Выйти</v-btn>
          <v-switch v-model="isDark" label="Темная тема" class="ml-4" @change="toggleTheme"></v-switch>
      </v-app-bar>
      <v-main>
          <v-snackbar v-model="showSnackbar" :color="snackbarColor" timeout="3000">
              {{ snackbarText }}
              <template v-slot:action="{ attrs }">
                  <v-btn text v-bind="attrs" @click="showSnackbar = false">Закрыть</v-btn>
              </template>
          </v-snackbar>
          <NuxtPage />
      </v-main>
      <v-footer app color="grey lighten-2">
          <v-row justify="center" class="py-4">
              <v-col cols="12" class="text-center">
                  © {{ new Date().getFullYear() }} Образовательная платформа
              </v-col>
          </v-row>
      </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
      return {
          showSnackbar: false,
          snackbarText: '',
          snackbarColor: 'success',
          isDark: false,
      };
  },
  computed: {
      isAuthenticated() {
          if (process.client) {
              return !!localStorage.getItem('token');
          }
          return false;
      },
  },
  watch: {
      isDark(newValue) {
          const nuxtApp = useNuxtApp();
          nuxtApp.$vuetify.theme.global.name.value = newValue ? 'dark' : 'light';
          console.log('Theme updated to:', newValue ? 'dark' : 'light');
      },
  },
  methods: {
      logout() {
          if (process.client) {
              localStorage.removeItem('token');
          }
          this.$router.push('/');
          this.showNotification('Вы вышли!', 'info');
      },
      handleRegisterClick() {
          console.log('Register button clicked');
      },
      toggleTheme(value) {
          this.isDark = value;
          console.log('Theme changed to:', value ? 'dark' : 'light');
      },
      showNotification(text, color = 'success') {
          this.snackbarText = text;
          this.snackbarColor = color;
          this.showSnackbar = true;
      },
  },
  mounted() {
      if (process.client) {
          const nuxtApp = useNuxtApp();
          this.isDark = nuxtApp.$vuetify.theme.global.name.value === 'dark';
          console.log('Initial theme:', this.isDark ? 'dark' : 'light');
      }
      // Заменяем this.$on на обработку событий через $emit
      this.$on = (...args) => this.$emit(...args);
      this.$on('notification', (payload) => {
          this.showNotification(payload.text, payload.color);
      });
      const nuxtApp = useNuxtApp();
      nuxtApp.hook('app:error', (error) => {
          if (error.response && error.response.status === 401) {
              this.showNotification('Необходима авторизация. Пожалуйста, зарегистрируйтесь.', 'error');
              if (process.client) {
                  localStorage.removeItem('token');
              }
              this.$router.push('/register');
          }
      });
  },
};
</script>