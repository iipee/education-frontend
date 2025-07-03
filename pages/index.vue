<template>
    <v-container>
        <v-row>
            <v-col>
                <v-text-field v-model="search" label="Поиск курсов" clearable></v-text-field>
                <h1>Курсы</h1>
                <v-card v-for="course in filteredCourses" :key="course.id" class="mb-4" v-if="filteredCourses.length">
                    <v-card-title>{{ course.title }}</v-card-title>
                    <v-card-text>{{ course.description }}</v-card-text>
                    <v-card-actions>
                        <v-btn :href="course.video_url" target="_blank">Смотреть видео</v-btn>
                        <v-btn @click="deleteCourse(course.id)" color="error" text>Удалить</v-btn>
                        <v-btn :to="`/courses/edit/${course.id}`" text>Редактировать</v-btn>
                    </v-card-actions>
                </v-card>
                <v-alert v-else type="info" text="Нет доступных курсов." />
                <v-btn to="/courses/create" color="primary" class="mt-4">Создать курс</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    middleware: ['auth'],
    data() {
        return { courses: [], search: '' };
    },
    async asyncData({ $fetch, $config }) {
        const courses = await $fetch(`${$config.public.apiBase}/api/courses`).catch((error) => {
            console.error('Fetch error:', error);
            return [];
        });
        return { courses };
    },
    computed: {
        filteredCourses() {
            return this.courses.filter(course =>
                course.title.toLowerCase().includes(this.search.toLowerCase())
            );
        },
    },
    methods: {
        async deleteCourse(id) {
            if (confirm('Вы уверены?')) {
                const response = await $fetch(`${$config.public.apiBase}/api/courses/${id}`, {
                    method: 'DELETE',
                }).catch((error) => {
                    console.error('Delete error:', error);
                });
                if (response) {
                    this.courses = this.courses.filter(course => course.id !== id);
                    this.showNotification('Курс удалён!', 'success');
                } else {
                    this.showNotification('Ошибка удаления', 'error');
                }
            }
        },
        showNotification(text, color = 'success') {
            this.$emit('notification', { text, color });
        },
    },
};
</script>