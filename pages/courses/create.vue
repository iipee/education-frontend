<template>
    <v-container>
        <v-row>
            <v-col cols="12" sm="6">
                <v-form ref="form" @submit.prevent="createCourse">
                    <v-text-field v-model="form.title" label="Название курса" required></v-text-field>
                    <v-textarea v-model="form.description" label="Описание" required></v-textarea>
                    <v-text-field v-model="form.video_url" label="URL видео" required></v-text-field>
                    <v-text-field v-model="form.teacher_id" label="ID учителя" type="number" required></v-text-field>
                    <v-btn type="submit" color="primary">Создать курс</v-btn>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    middleware: ['auth'],
    data() {
        return { form: { title: '', description: '', video_url: '', teacher_id: 0 } };
    },
    methods: {
        async createCourse() {
            if (!this.form.title || !this.form.description || !this.form.video_url || !this.form.teacher_id) {
                this.showNotification('Введите все необходимые данные', 'error');
                return;
            }
            const response = await $fetch(`${$config.public.apiBase}/api/courses`, {
                method: 'POST',
                body: this.form,
            });
            if (response) {
                this.showNotification('Курс создан!', 'success');
                this.$router.push('/');
            } else {
                this.showNotification('Ошибка создания', 'error');
            }
        },
        showNotification(text, color = 'success') {
            this.$emit('notification', { text, color });
        },
    },
};
</script>