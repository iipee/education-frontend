import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('getToken', () => localStorage.getItem('token'))
  nuxtApp.provide('setToken', (token, role) => {
    localStorage.setItem('token', token)
    localStorage.setItem('role', role)
  })
  nuxtApp.provide('clearToken', () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
  })
})