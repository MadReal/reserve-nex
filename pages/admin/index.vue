<script setup lang="ts">
definePageMeta({
    layout: false,
    middleware: defineNuxtRouteMiddleware((to, from) => {
        return navigateTo("/admin/reservations");
    }),
})
</script>


<template lang="pug">
.admin-page
    p Admin
</template>
