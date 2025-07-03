<template>
    <v-container>
        <v-row>
            <v-col cols="12" sm="6">
                <v-form @submit.prevent="updateCourse">
                    <v-text-field v-model="form.title" label="Название курса" required></v-text-field>
                    <v-textarea v-model="form.description" label="Описание" required></v-textarea>
                    <v-text-field v-model="form.video_url" label="URL видео" required></v-text-field>
                    <v-text-field v-model="form.teacher_id" label="ID учителя" type="number" required></v-text-field>
                    <v-btn type="submit" color="primary">Обновить курс</v-btn>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    middleware: ['auth'],
    async asyncData({ params, $fetch, $config }) {
        const course = await $fetch(`${$config.public.apiBase}/api/courses/${params.id}`).catch((error) => {
            console.error('Fetch error:', error);
            return {};
        });
        return { form: { ...course } };
    },
    methods: {
        async updateCourse() {
            await $fetch(`${$config.public.apiBase}/api/courses/${this.$route.params.id}`, {
                method: 'PUT',
                body: this.form,
            }).catch((error) => {
                console.error('Update error:', error);
            });
            this.showNotification('Курс обновлён!', 'success');
            this.$router.push('/');
        },
        showNotification(text, color = 'success') {
            this.$emit('notification', { text, color });
        },
    },
};
</script>