<script setup lang="ts">
definePageMeta({
    layout: false,
    middleware: defineNuxtRouteMiddleware((to, from) => {
        return navigateTo("/admin/reservations");
    }),
})
</script>


<template lang="pug">
.page__content
    p Admin
</template>
