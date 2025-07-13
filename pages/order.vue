<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-6">
          <v-card-title class="justify-center">
            <h2>Заказ услуги</h2>
          </v-card-title>
          <v-card-text>
            <p>Страница заказа услуги (в разработке).</p>
            <v-btn color="primary" to="/profile" block class="mt-4">
              Вернуться в профиль
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
definePageMeta({ middleware: 'auth' });
</script>