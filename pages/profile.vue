<template>
    <v-container>
        <v-row>
            <v-col>
                <h1>Профиль</h1>
                <v-card>
                    <v-card-text>
                        <p>Имя пользователя: {{ username }}</p>
                        <p>Роль: {{ role }}</p>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    middleware: ['auth'],
    data() {
        return { username: '', role: '' };
    },
    async mounted() {
        if (process.client) {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                this.username = decoded.username;
                this.role = decoded.role;
            }
        }
    },
};
</script>