<template>
    <v-container>
        <v-row>
            <v-col cols="12" sm="6">
                <v-form @submit.prevent="createCourse">
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
    data() {
        return { form: { title: '', description: '', video_url: '', teacher_id: null } };
    },
    methods: {
        async createCourse() {
            await $fetch('/api/courses', { method: 'POST', body: this.form });
            this.$router.push('/');
        },
    },
};
</script>