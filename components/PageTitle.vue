<script setup lang="ts">
export interface PageTitleProps {
    title: string
    showDate?: boolean
}
const props = withDefaults(defineProps<PageTitleProps>(), {
    showDate: false
})

const formatDateAndTime = (isoTimestamp: string) => useDateTimeFormatting(isoTimestamp);
const todaysDate = formatDateAndTime(Date()).formattedDate
</script>


<template lang="pug">
.flex.items-end.mb-10.gap-2
    h1.text-black.text-2xl.font-semibold {{ title }}
    p.text-grey-200.font-light.leading-7(v-if="showDate") {{ `(${todaysDate})` }}
</template>