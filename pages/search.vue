<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-text-field
          v-model="searchQuery"
          label="Поиск нутрициолога или услуги"
          prepend-icon="mdi-magnify"
          clearable
          @input="search"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="(nutritionist, index) in nutritionists" :key="index" cols="12" sm="6" md="4">
        <v-card class="pa-4">
          <v-card-title>{{ nutritionist.name }}</v-card-title>
          <v-card-text>{{ nutritionist.description }}</v-card-text>
          <v-card-actions>
            <v-btn color="primary" :to="`/profile/${nutritionist.id}`">Посмотреть профиль</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      nutritionists: [
        { id: 1, name: 'Иван Иванов', description: 'Составление планов питания.' },
        { id: 2, name: 'Елена Петрова', description: 'Консультации по здоровому питанию.' }
      ]
    }
  },
  methods: {
    search() {
      console.log('Поиск:', this.searchQuery)
      // Пример: this.$axios.get(`/api/search?q=${this.searchQuery}`).then(response => { ... })
    }
  }
}
</script>