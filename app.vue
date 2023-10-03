<script setup lang="ts">
const { path } = useRoute();
console.log(path);

useHead({
  titleTemplate: (pageTitle) => {
    if (path === "/") return `ReserveNex - ${pageTitle}`;
    return pageTitle ? `${pageTitle} - ReserveNex` : "ReserveNex";
  },
});
</script>

<template lang="pug">
NuxtLayout
  NuxtPage
  ModalManager
  NotificationManager
</template>
