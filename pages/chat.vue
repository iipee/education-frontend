<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-6">
          <v-card-title class="justify-center">
            <h2>Чат с нутрициологом</h2>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="(message, index) in messages" :key="index">
                <v-list-item-content>
                  <v-list-item-title>{{ message.text }}</v-list-item-title>
                  <v-list-item-subtitle>{{ message.author }} ({{ message.time }})</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-text-field
              v-model="newMessage"
              label="Введите сообщение"
              prepend-icon="mdi-message"
              clearable
              @keyup.enter="sendMessage"
            />
            <v-btn color="primary" block @click="sendMessage">Отправить</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const newMessage = ref('')
const messages = ref([
  { text: 'Здравствуйте! Хочу обсудить план питания.', author: 'Клиент', time: '10:00' },
  { text: 'Добрый день! Давайте начнем с ваших целей.', author: 'Нутрициолог', time: '10:05' }
])

const sendMessage = () => {
  if (newMessage.value) {
    messages.value.push({
      text: newMessage.value,
      author: 'Клиент',
      time: new Date().toLocaleTimeString()
    })
    newMessage.value = ''
  }
}
</script>