import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || '',
    userId: localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')) : null
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    isNutri: (state) => state.role === 'nutri'
  },
  actions: {
    setUser(token, role, id) {
      if (process.client) {
        localStorage.setItem('token', token)
        localStorage.setItem('role', role)
        localStorage.setItem('userId', id)
      }
      this.token = token
      this.role = role
      this.userId = id
    },
    logout() {
      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('userId')
      }
      this.token = null
      this.role = ''
      this.userId = null
    }
  }
})