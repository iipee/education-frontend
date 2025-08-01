import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin((nuxtApp) => {
  let ws = null
  const { $chatStore, $emitter } = nuxtApp

  const connectWebSocket = () => {
    if (!process.client) return
    const token = localStorage.getItem('token')
    if (!token) return

    const config = nuxtApp.$config.public
    try {
      ws = new WebSocket(`${config.wsBase}/ws?token=${token}`)
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === 'message') {
          $chatStore.handleNewMessage(data.data)
          $emitter.emit('message', data.data)
        } else if (data.type === 'notification') {
          $emitter.emit('notification', data.data)
        }
      }
      ws.onclose = () => {
        setTimeout(connectWebSocket, 5000)
      }
      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    } catch (error) {
      console.error('WebSocket connection error:', error)
    }
  }

  const disconnectWebSocket = () => {
    if (ws) {
      ws.close()
      ws = null
    }
  }

  if (process.client) {
    const token = localStorage.getItem('token')
    if (token) connectWebSocket()
    nuxtApp.$emitter.on('login', connectWebSocket)
    nuxtApp.$emitter.on('logout', disconnectWebSocket)
  }

  return {
    provide: {
      websocket: {
        connect: connectWebSocket,
        disconnect: disconnectWebSocket
      }
    }
  }
})