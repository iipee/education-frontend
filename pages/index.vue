<template>
  <v-container>
    <v-row justify="center" class="text-center mb-6">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">Добро пожаловать на платформу для нутрициологов</h1>
        <p class="text-subtitle-1 mt-4">Найдите профессионального нутрициолога, создайте свои услуги или начните общение прямо сейчас!</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-4" elevation="2" hover to="/login">
          <v-card-title class="justify-center">
            <v-icon large class="mr-2">mdi-login</v-icon>
            Войти
          </v-card-title>
          <v-card-text>Войдите, чтобы начать работу.</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-4" elevation="2" hover to="/profile">
          <v-card-title class="justify-center">
            <v-icon large class="mr-2">mdi-account</v-icon>
            Профиль
          </v-card-title>
          <v-card-text>Просмотрите или обновите ваш профиль.</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-4" elevation="2" hover to="/search">
          <v-card-title class="justify-center">
            <v-icon large class="mr-2">mdi-magnify</v-icon>
            Поиск
          </v-card-title>
          <v-card-text>Найдите нутрициолога или услугу.</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-4" elevation="2" hover to="/chat">
          <v-card-title class="justify-center">
            <v-icon large class="mr-2">mdi-message</v-icon>
            Чат
          </v-card-title>
          <v-card-text>Общайтесь с нутрициологом.</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-4" elevation="2" hover to="/courses/create">
          <v-card-title class="justify-center">
            <v-icon large class="mr-2">mdi-food-apple</v-icon>
            Создать услугу
          </v-card-title>
          <v-card-text>Добавьте новую услугу для клиентов.</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-4" elevation="2" hover to="/order">
          <v-card-title class="justify-center">
            <v-icon large class="mr-2">mdi-cart</v-icon>
            Заказ услуги
          </v-card-title>
          <v-card-text>Закажите услугу у нутрициолога.</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const token = localStorage.getItem('token')
const isLoggedIn = !!token
const role = localStorage.getItem('role')
</script>