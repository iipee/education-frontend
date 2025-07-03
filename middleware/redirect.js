export default defineNuxtRouteMiddleware((to, from) => {
    if (to.path === '/courses') {
        return navigateTo('/');
    }
});