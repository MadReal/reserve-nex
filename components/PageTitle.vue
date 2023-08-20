<script setup lang="ts">
export interface PageTitleProps {
    title: string
    date?: string
}
const props = defineProps<PageTitleProps>()
</script>


<template lang="pug">
.flex.items-end.mb-10.gap-2
    h1.text-black.text-2xl.font-semibold {{ title }}
    p.text-grey-200.font-light.leading-7(v-if="date") {{ `(${date})` }}
</template>