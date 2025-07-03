<template>
    <v-container>
        <v-row>
            <v-col>
                <h1>Чат</h1>
                <v-text-field v-model="message" label="Сообщение" @keyup.enter="sendMessage"></v-text-field>
                <v-list>
                    <v-list-item v-for="(msg, index) in messages" :key="index">{{ msg }}</v-list-item>
                </v-list>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    middleware: ['auth'],
    data() {
        return {
            message: '',
            messages: [],
            ws: null,
        };
    },
    mounted() {
        if (process.client) {
            this.ws = new WebSocket(`${$config.public.apiBase.replace('http', 'ws')}/ws`);
            this.ws.onmessage = (event) => {
                this.messages.push(event.data);
            };
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        }
    },
    methods: {
        sendMessage() {
            if (this.message && this.ws) {
                this.ws.send(this.message);
                this.message = '';
            }
        },
    },
    beforeDestroy() {
        if (this.ws) this.ws.close();
    },
};
</script>