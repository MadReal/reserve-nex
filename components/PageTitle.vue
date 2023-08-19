<script setup lang="ts">
const props = defineProps({
    title: String,
})
</script>


<template lang="pug">
h1.text-black.text-2xl.font-semibold.mb-10 {{ title }}
</template>