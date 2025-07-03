<template>
    <v-container>
        <v-row>
            <v-col>
                <h1>Курсы</h1>
                <v-card v-for="course in courses" :key="course.id" class="mb-4">
                    <v-card-title>{{ course.title }}</v-card-title>
                    <v-card-text>{{ course.description }}</v-card-text>
                    <v-card-actions>
                        <v-btn :href="course.video_url" target="_blank">Смотреть видео</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    async asyncData({ $fetch }) {
        const courses = await $fetch('/api/courses');
        return { courses };
    },
};
</script>