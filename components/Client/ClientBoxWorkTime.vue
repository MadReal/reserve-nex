<script setup lang="ts">
interface ClientBoxWorkTimeProps {
    workTime: WorkTime,
    isSelected: boolean
}
const props = withDefaults(defineProps<ClientBoxWorkTimeProps>(), {
    isSelected: false
})

// if time analyzed from the array equals time being passed from template, add people
</script>


<template lang="pug">
.rounded-lg.p-4.border.border-gray-100.text-grey-200.cursor-pointer.hover_border-primary-100(:class="{ 'border-primary-100' : isSelected }", @click="$emit('selectWorkTime', workTime)")
    .flex.items-center.justify-center.hover_text-primary-100(:class="{ 'text-primary-100' : isSelected }")
        SVGIcon.mr-1(svg="clock", :size="15")
        p {{ workTime.time }}
</template>
