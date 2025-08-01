<template>
    <v-container fluid>
      <v-row>
        <v-navigation-drawer v-model="drawer" width="300" permanent aria-label="Список диалогов">
          <v-list aria-label="Диалоги">
            <v-list-item
              v-for="(dialog, index) in chatStore.dialogs"
              :key="index"
              :active="dialog.user_id === selectedDialog?.user_id"
              @click="selectDialog(dialog)"
              aria-label="Диалог"
            >
              <v-list-item-avatar>
                <v-avatar size="40">
                  <v-img 
                    src="/images/nutri-placeholder.jpg" 
                    aria-label="Аватар пользователя"
                  >
                    <template v-slot:placeholder>
                      <v-icon size="40" color="#CED4DA">mdi-account-circle</v-icon>
                    </template>
                  </v-img>
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title aria-label="Имя пользователя">{{ dialog.full_name }}</v-list-item-title>
                <v-list-item-subtitle aria-label="Последнее сообщение">{{ dialog.last_message }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-badge v-if="dialog.unread_count > 0" :content="dialog.unread_count" color="error" />
              </v-list-item-action>
            </v-list-item>
            <v-list-item v-if="chatStore.dialogs.length === 0" aria-label="Диалогов нет">
              <v-list-item-title>Диалогов нет</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
        <v-main>
          <v-card v-if="selectedDialog" class="pa-6" height="500" aria-label="Чат с пользователем">
            <v-card-title aria-label="Чат с {{ selectedDialog.full_name }}">Чат с {{ selectedDialog.full_name }}</v-card-title>
            <v-card-text>
              <v-list height="300" class="overflow-y-auto" aria-label="Список сообщений">
                <v-list-item 
                  v-for="(message, index) in chatStore.messages" 
                  :key="index" 
                  :class="message.sender_id === userId ? 'text-right' : 'text-left'"
                  aria-label="Сообщение"
                >
                  <v-list-item-content>
                    <v-chip 
                      :color="message.sender_id === userId ? 'primary' : 'grey lighten-3'"
                      :text-color="message.sender_id === userId ? 'white' : 'black'"
                      class="pa-2"
                      aria-label="Текст сообщения"
                    >
                      {{ message.content }}
                    </v-chip>
                    <v-list-item-subtitle aria-label="Время сообщения">{{ formatDate(message.created_at) }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-textarea
                v-model="newMessage"
                label="Введите сообщение"
                rows="2"
                auto-grow
                prepend-inner-icon="mdi-message"
                clearable
                @keyup.enter="sendMessage"
                aria-label="Поле ввода сообщения"
              />
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="sendMessage" v-tooltip="'Отправить сообщение'" aria-label="Отправить сообщение">Отправить</v-btn>
            </v-card-actions>
          </v-card>
          <v-card v-else class="pa-6" height="500" aria-label="Выберите диалог">
            <v-card-text>
              <p class="text-center" aria-label="Выберите диалог для общения">Выберите диалог для общения</p>
            </v-card-text>
          </v-card>
        </v-main>
      </v-row>
      <v-snackbar v-model="snackbar" color="error" timeout="3000" aria-label="Уведомление об ошибке">
        {{ errorMessage }}
      </v-snackbar>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, computed } from 'vue'
  import { useRuntimeConfig } from 'nuxt/app'
  import { useRoute, useRouter } from 'vue-router'
  import { useNuxtApp } from 'nuxt/app'
  import { useChatStore } from '~/stores/chat'
  
  definePageMeta({ middleware: 'auth' })
  
  const { $emitter } = useNuxtApp()
  const emitter = $emitter
  const config = useRuntimeConfig()
  const route = useRoute()
  const router = useRouter()
  const chatStore = useChatStore()
  const drawer = ref(true)
  const selectedDialog = ref(null)
  const newMessage = ref('')
  const userId = ref(null)
  const snackbar = ref(false)
  const errorMessage = ref('')
  
  onMounted(async () => {
    if (process.client) {
      userId.value = localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')) : null
    }
    try {
      await chatStore.fetchDialogs()
      if (route.query.selected) {
        const dialog = chatStore.dialogs.find(d => d.user_id === parseInt(route.query.selected))
        if (dialog) {
          await selectDialog(dialog)
        }
      }
    } catch (error) {
      errorMessage.value = 'Ошибка загрузки диалогов: ' + (error.message || 'Неизвестная ошибка')
      snackbar.value = true
    }
    emitter.on('message', chatStore.handleNewMessage)
  })
  
  onUnmounted(() => {
    emitter.off('message', chatStore.handleNewMessage)
  })
  
  const selectDialog = async (dialog) => {
    selectedDialog.value = dialog
    try {
      await chatStore.fetchMessages(dialog.user_id)
    } catch (error) {
      errorMessage.value = 'Ошибка загрузки сообщений: ' + (error.message || 'Неизвестная ошибка')
      snackbar.value = true
    }
  }
  
  const sendMessage = async () => {
    if (!newMessage.value || !selectedDialog.value) return
    try {
      await chatStore.sendMessage(selectedDialog.value.user_id, newMessage.value)
      newMessage.value = ''
    } catch (error) {
      errorMessage.value = 'Ошибка отправки сообщения: ' + (error.message || 'Неизвестная ошибка')
      snackbar.value = true
    }
  }
  
  const formatDate = (date) => {
    return new Date(date).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' })
  }
  </script>