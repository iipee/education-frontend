import { defineNuxtPlugin } from '#app';
import type { FetchOptions } from 'ofetch';

export default defineNuxtPlugin((nuxtApp) => {
    const originalFetch = nuxtApp.$fetch as typeof fetch; // Явная типизация $fetch
    nuxtApp.provide('fetch', async (url: string, opts: FetchOptions = {}) => {
        if (process.client) {
            const token = localStorage.getItem('token');
            if (token) {
                // Создаем новый объект Headers для добавления кастомного заголовка
                const headers = new Headers(opts.headers as HeadersInit);
                headers.set('Authorization', `Bearer ${token}`);
                
                // Устанавливаем Content-Type, если он не задан и body является объектом
                if (opts.body && typeof opts.body === 'object' && !headers.has('Content-Type')) {
                    headers.set('Content-Type', 'application/json');
                }
                opts.headers = headers;

                // Сериализуем body, если это объект
                if (opts.body && typeof opts.body === 'object') {
                    opts.body = JSON.stringify(opts.body);
                }
            }
        }
        return await originalFetch(url, opts as RequestInit);
    });
});