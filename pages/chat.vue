<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-6" height="500" aria-label="Чат с нутрициологом">
          <v-card-title class="justify-center">
            <h2 aria-label="Чат с нутрициологом">Чат с нутрициологом</h2>
          </v-card-title>
          <v-card-text>
            <v-list height="300" class="overflow-y-auto" aria-label="Список сообщений">
              <v-list-item 
                v-for="(message, index) in messages" 
                :key="index" 
                :class="message.sender_id === userId ? 'text-right' : 'text-left'"
                aria-label="Сообщение"
              >
                <v-list-item-content>
                  <v-list-item-title 
                    :class="message.sender_id === userId ? 'bg-primary text-white pa-2 rounded' : 'bg-light text-dark pa-2 rounded'"
                    aria-label="Текст сообщения"
                  >
                    {{ message.content }}
                  </v-list-item-title>
                  <v-list-item-subtitle aria-label="Время сообщения">{{ message.created_at }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-text-field
              v-model="newMessage"
              label="Введите сообщение"
              prepend-icon="mdi-message"
              clearable
              @input="newMessage = $event !== null ? $event : ''"
              @keyup.enter="sendMessage"
              aria-label="Поле ввода сообщения"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" block @click="sendMessage" v-tooltip="'Отправить сообщение'" aria-label="Отправить сообщение">Отправить</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import { useRoute } from 'vue-router'
import { useNuxtApp } from 'nuxt/app'

const { $emitter } = useNuxtApp()
const emitter = $emitter
const config = useRuntimeConfig()
const route = useRoute()
const receiverId = ref(route.query.receiver_id ? parseInt(route.query.receiver_id) : null)
const newMessage = ref('')
const messages = ref([])
const token = ref(null)
const userId = ref(null)
const ws = ref(null)

onMounted(async () => {
  if (process.client) {
    token.value = localStorage.getItem('token')
    userId.value = parseInt(localStorage.getItem('userId'))
    if (!token.value || !receiverId.value) {
      return
    }
  }
  await loadMessages()
  connectWebSocket()
  emitter.on('message', handleNewMessage)
})

onUnmounted(() => {
  if (ws.value) ws.value.close()
  emitter.off('message', handleNewMessage)
})

const loadMessages = async () => {
  const headers = { Authorization: `Bearer ${token.value}` }
  const { data, error } = await useFetch(`${config.public.apiBase}/api/messages?receiver_id=${receiverId.value}`, { headers })
  if (!error.value) {
    messages.value = data.value || []
    await markRead()
  }
}

const sendMessage = async () => {
  if (!newMessage.value) return
  const headers = { Authorization: `Bearer ${token.value}` }
  const body = { receiver_id: receiverId.value, content: newMessage.value }
  const { data, error } = await useFetch(`${config.public.apiBase}/api/messages`, { method: 'POST', headers, body })
  if (!error.value) {
    messages.value.push(data.value)
    newMessage.value = ''
    emitter.emit('message', data.value)
  }
}

const markRead = async () => {
  const headers = { Authorization: `Bearer ${token.value}` }
  await useFetch(`${config.public.apiBase}/api/messages/read?receiver_id=${receiverId.value}`, { method: 'PUT', headers })
}

const handleNewMessage = (msg) => {
  if (msg.sender_id === receiverId.value || msg.receiver_id === receiverId.value) {
    messages.value.push(msg)
    markRead()
  }
}

const connectWebSocket = () => {
  if (!token.value) return
  ws.value = new WebSocket(`${config.public.wsBase}/ws?token=${token.value}`)
  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.type === 'message') {
      handleNewMessage(data.data)
    }
  }
  ws.value.onclose = () => {
    setTimeout(connectWebSocket, 5000)
  }
}
</script>