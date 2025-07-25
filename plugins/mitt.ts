import mitt from 'mitt'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const emitter = mitt()
  return {
    provide: {
      emitter
    }
  }
})