<script setup lang="ts">
interface ClientBoxWorkTimeProps {
    time: WorkTime["time"],
    isSelected: boolean
}
const props = withDefaults(defineProps<ClientBoxWorkTimeProps>(), {
    isSelected: false
})
</script>


<template lang="pug">
.rounded-lg.p-4.border.border-gray-100.text-grey-200.cursor-pointer.hover_border-primary-100(:class="{ 'border-primary-100' : isSelected }", @click="$emit('selectTime', time)")
    .flex.items-center.justify-center.hover_text-primary-100(:class="{ 'text-primary-100' : isSelected }")
        SVGIcon.mr-1(svg="clock", :size="15")
        p {{ time }}
</template>
