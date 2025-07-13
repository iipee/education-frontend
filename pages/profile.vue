<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-6">
          <v-card-title class="justify-center">
            <h2>Профиль нутрициолога</h2>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <h3>{{ profile.name }}</h3>
                <p>{{ profile.description }}</p>
              </v-col>
              <v-col cols="12">
                <h4>Услуги</h4>
                <v-list>
                  <v-list-item v-for="(service, index) in profile.services" :key="index">
                    <v-list-item-content>
                      <v-list-item-title>{{ service }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12">
                <h4>Отзывы</h4>
                <v-list>
                  <v-list-item v-for="(review, index) in profile.reviews" :key="index">
                    <v-list-item-content>
                      <v-list-item-title>{{ review.text }}</v-list-item-title>
                      <v-list-item-subtitle>— {{ review.author }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
            <v-btn color="primary" to="/order" block class="mt-4">
              Заказать услугу
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      profile: {
        name: 'Иван Иванов',
        description: 'Профессиональный нутрициолог с 5-летним опытом. Специализируюсь на составлении индивидуальных планов питания.',
        services: ['Консультация', 'План питания', 'Сопровождение'],
        reviews: [
          { text: 'Отличный специалист, помог сбросить 5 кг!', author: 'Анна' },
          { text: 'План питания очень удобный, рекомендую!', author: 'Мария' }
        ]
      }
    }
  }
}
</script>