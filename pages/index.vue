<script setup lang="ts">
definePageMeta({ layout: false, })

</script>


<template lang="pug">
.page
    p.mb-4 Index
    NuxtLink.py-2.px-4.bg-primary-200.text-white.rounded.hover_shadow(to="/admin/reservations") Check Admin
</template>
