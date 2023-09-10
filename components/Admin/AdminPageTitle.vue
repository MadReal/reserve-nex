<script setup lang="ts">
interface PageTitleProps {
    title: string
    subtitle: string,
    date?: string
}
const props = defineProps<PageTitleProps>()
</script>


<template lang="pug">
.mb-10
    .flex.items-end.gap-2
        h1.text-black.text-2xl.font-semibold {{ title }}
        p.text-grey-200.font-light.leading-7(v-if="date") {{ `(${date})` }}

    p.mt-1.text-sm.text-grey-200.opacity-60.font-light(v-if="subtitle") {{ subtitle }}
</template>