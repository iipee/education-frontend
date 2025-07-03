<template>
    <v-container>
        <v-row>
            <v-col cols="12" sm="6">
                <v-form ref="form" @submit.prevent="register">
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
        return {
            form: { username: '', password: '', role: 'student' },
        };
    },
    methods: {
        async register() {
            if (!this.form.username || !this.form.password || !this.form.role) {
                this.showNotification('Введите необходимые данные для продолжения', 'error');
                return;
            }
            const response = await $fetch(`${$config.public.apiBase}/api/register`, {
                method: 'POST',
                body: this.form,
            });
            if (response.token) {
                if (process.client) {
                    localStorage.setItem('token', response.token);
                }
                this.showNotification('Регистрация успешна!', 'success');
                this.$router.push('/');
            } else {
                this.showNotification('Ошибка регистрации', 'error');
            }
        },
        showNotification(text, color = 'success') {
            this.$emit('notification', { text, color });
        },
    },
};
</script>