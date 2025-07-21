<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-6">
          <v-card-title class="justify-center">
            <h2>Оплата заказа</h2>
          </v-card-title>
          <v-card-text>
            <p>Сумма: {{ amount }} руб.</p>
            <v-btn color="primary" block @click="pay">Оплатить</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from 'nuxt/app'

const config = useRuntimeConfig()
const route = useRoute()
const orderId = route.query.order_id
const amount = route.query.amount
const token = ref(null)

onMounted(() => {
  if (process.client) {
    token.value = localStorage.getItem('token')
  }
})

const pay = () => {
  console.log("Тест оплаты прошел успешно для заказа", orderId, "на сумму", amount)
}
</script>