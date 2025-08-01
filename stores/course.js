import { defineStore } from 'pinia'
import { useRuntimeConfig } from 'nuxt/app'

export const useCourseStore = defineStore('course', {
  state: () => ({
    course: {},
    reviews: [],
    isPaid: false,
    canReview: false,
    transactionId: null,
    loading: false,
    error: null
  }),
  actions: {
    async loadCourse(id) {
      this.loading = true
      const config = useRuntimeConfig()
      const headers = process.client && localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}
      try {
        const { data } = await $fetch(`${config.public.apiBase}/api/courses/${id}`, { headers })
        this.course = data || {}
        await this.loadReviews(id)
      } catch (error) {
        this.error = error.message || 'Неизвестная ошибка'
        throw error
      } finally {
        this.loading = false
      }
    },
    async loadReviews(id) {
      const config = useRuntimeConfig()
      const headers = process.client && localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}
      try {
        const { data } = await $fetch(`${config.public.apiBase}/api/reviews/course/${id}`, { headers })
        this.reviews = data || []
      } catch (error) {
        this.error = error.message || 'Неизвестная ошибка'
        throw error
      }
    },
    async checkCanReview(userId) {
      const config = useRuntimeConfig()
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` }
      try {
        const { data } = await $fetch(`${config.public.apiBase}/api/payments`, { headers })
        this.isPaid = data.some(p => p.course_id === parseInt(this.course.id) && p.status === 'success')
        this.canReview = this.isPaid
      } catch (error) {
        this.error = error.message || 'Неизвестная ошибка'
        throw error
      }
    },
    async submitPayment(courseId, userId) {
      const config = useRuntimeConfig()
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` }
      const body = { course_id: parseInt(courseId) }
      try {
        const { data } = await $fetch(`${config.public.apiBase}/api/payments/simulate`, { method: 'POST', headers, body })
        this.transactionId = data.transaction_id
        this.isPaid = true
        this.canReview = true
      } catch (error) {
        this.error = error.message || 'Неизвестная ошибка'
        throw error
      }
    },
    async submitReview(courseId, content, userId) {
      const config = useRuntimeConfig()
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` }
      const body = { course_id: parseInt(courseId), content }
      try {
        const { data } = await $fetch(`${config.public.apiBase}/api/reviews`, { method: 'POST', headers, body })
        this.reviews.push(data)
      } catch (error) {
        this.error = error.message || 'Неизвестная ошибка'
        throw error
      }
    },
    handleNewMessage(msg) {
      // Реализация обработки новых сообщений (если нужно для чата)
    }
  }
})