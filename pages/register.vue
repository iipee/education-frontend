<template>
    <v-container>
        <v-row>
            <v-col cols="12" sm="6">
                <v-form @submit.prevent="register">
                    <v-text-field v-model="form.username" label="Имя пользователя" required></v-text-field>
                    <v-text-field v-model="form.password" label="Пароль" type="password" required></v-text-field>
                    <v-select v-model="form.role" :items="['student', 'teacher']" label="Роль" required></v-select>
                    <v-btn type="submit" color="primary">Зарегистрироваться</v-btn>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data() {
        return { form: { username: '', password: '', role: 'student' } };
    },
    methods: {
        async register() {
            await $fetch('/api/register', { method: 'POST', body: this.form });
            this.$router.push('/');
        },
    },
};
</script>