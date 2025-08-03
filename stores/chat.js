import { defineStore } from 'pinia'
import { useRuntimeConfig } from 'nuxt/app'

export const useChatStore = defineStore('chat', {
  state: () => ({
    dialogs: [],
    messages: [],
    loading: false,
    error: null
  }),
  getters: {
    unreadCount: (state) => state.dialogs.reduce((sum, dialog) => sum + (dialog.unread_count || 0), 0)
  },
  actions: {
    async fetchDialogs() {
      this.loading = true
      const config = useRuntimeConfig()
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` }
      try {
        const data = await $fetch(`${config.public.apiBase}/api/chats`, { headers })
        this.dialogs = data || []
      } catch (error) {
        this.error = error.message || 'Неизвестная ошибка'
        this.dialogs = []
      } finally {
        this.loading = false
      }
    },
    async fetchMessages(receiverId) {
      this.loading = true
      const config = useRuntimeConfig()
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` }
      try {
        const data = await $fetch(`${config.public.apiBase}/api/messages?receiver_id=${receiverId}`, { headers })
        this.messages = data || []
        await this.markRead(receiverId)
      } catch (error) {
        this.error = error.message || 'Неизвестная ошибка'
        this.messages = []
      } finally {
        this.loading = false
      }
    },
    async sendMessage(receiverId, content) {
      const config = useRuntimeConfig()
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` }
      const body = { receiver_id: receiverId, content }
      try {
        const data = await $fetch(`${config.public.apiBase}/api/messages`, { method: 'POST', headers, body })
        this.messages.push(data)
      } catch (error) {
        this.error = error.message || 'Неизвестная ошибка'
      }
    },
    async markRead(receiverId) {
      const config = useRuntimeConfig()
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` }
      try {
        await $fetch(`${config.public.apiBase}/api/messages/read?receiver_id=${receiverId}`, { method: 'PUT', headers })
        const dialog = this.dialogs.find(d => d.user_id === receiverId)
        if (dialog) dialog.unread_count = 0
      } catch (error) {
        this.error = error.message || 'Неизвестная ошибка'
      }
    },
    handleNewMessage(msg) {
      const currentUserId = parseInt(localStorage.getItem('userId'))
      if (msg.sender_id === currentUserId || msg.receiver_id === currentUserId) {
        this.messages.push(msg)
        this.markRead(msg.sender_id)
      }
      const dialog = this.dialogs.find(d => d.user_id === msg.sender_id || d.user_id === msg.receiver_id)
      if (dialog) {
        dialog.last_message = msg.content
        dialog.unread_count = msg.sender_id === currentUserId ? 0 : (dialog.unread_count || 0) + 1
      } else {
        this.fetchDialogs()
      }
    }
  }
})