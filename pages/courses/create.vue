<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-6">
          <v-card-title class="justify-center">
            <h2>Создать услугу</h2>
          </v-card-title>
          <v-card-text>
            <v-form v-model="valid" @submit.prevent="createService">
              <v-text-field
                v-model="form.title"
                label="Название услуги"
                prepend-icon="mdi-food-apple"
                :rules="[v => !!v || 'Название обязательно']"
                required
              />
              <v-textarea
                v-model="form.description"
                label="Описание услуги"
                prepend-icon="mdi-information"
                :rules="[v => !!v || 'Описание обязательно']"
                required
              />
              <v-text-field
                v-model="form.price"
                label="Стоимость (руб.)"
                prepend-icon="mdi-currency-rub"
                type="number"
                :rules="[v => !!v || 'Стоимость обязательна', v => v > 0 || 'Стоимость должна быть больше 0']"
                required
              />
              <v-btn
                color="primary"
                type="submit"
                :disabled="!valid"
                block
                class="mt-4"
              >
                Создать услугу
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
definePageMeta({ middleware: 'auth' });

const valid = ref(false);
const form = ref({
  title: '',
  description: '',
  price: 0
});

const createService = () => {
  if (valid.value) {
    console.log('Услуга создана:', form.value);
    useNuxtApp().$mitt.emit('notification', { text: 'Услуга создана!', color: 'success' });
    useRouter().push('/profile');
  } else {
    useNuxtApp().$mitt.emit('notification', { text: 'Заполните все поля', color: 'error' });
  }
};
</script>