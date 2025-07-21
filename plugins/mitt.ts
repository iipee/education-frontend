import mitt from 'mitt'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin((nuxtApp: any) => {
  const emitter = mitt()
  nuxtApp.provide('mitt', emitter)
})