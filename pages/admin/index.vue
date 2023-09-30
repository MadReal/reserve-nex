<script setup lang="ts">
definePageMeta({ middleware: defineNuxtRouteMiddleware((to, from) => navigateTo("/admin/reservations")) });
</script>
