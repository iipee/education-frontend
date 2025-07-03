<template>
    <v-container>
        <h1>Чат</h1>
        <div v-for="message in messages" :key="message.id">{{ message.text }}</div>
        <v-text-field v-model="newMessage" @keyup.enter="sendMessage" placeholder="Введите сообщение"></v-text-field>
    </v-container>
</template>

<script>
export default {
    data() {
        return { messages: [], newMessage: '', socket: null };
    },
    mounted() {
        this.socket = new WebSocket('ws://localhost:8080/ws');
        this.socket.onmessage = (event) => this.messages.push({ id: Date.now(), text: event.data });
    },
    methods: { sendMessage() { if (this.newMessage) { this.socket.send(this.newMessage); this.newMessage = ''; } } },
    beforeDestroy() { this.socket.close(); },
};
</script>