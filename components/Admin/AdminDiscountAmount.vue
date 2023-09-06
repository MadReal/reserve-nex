<script setup lang="ts">
interface Props {
    value: number | null
    isTrash?: boolean
}
const props = withDefaults(defineProps<Props>(), {
    isTrash: false
});
const emit = defineEmits(['updateOrDelete', 'dragstart', 'dragleave', 'dragend'])
</script>


<template lang="pug">
.relative.z-10.h-8.w-full.overflow-hidden.flex.items-center.justify-center.bg-red-500.text-white.text-sm.text-center.group(
    :class="{ 'bg-transparent' : !value, 'cursor-grab' : value }"    
    draggable="true", 
    @dragstart="$emit('dragstart', $event)",
    @dragleave="$emit('dragleave', $event)",
    @dragend="$emit('dragend', $event)",
    @dragenter.prevent, 
    @dragover.prevent)

    p(:class="{ 'group-hover_mr-2' : value }") {{ value }}{{ value ? '%' : '-' }}

    .absolute.px-1.hidden.z-10.inset-y-0.right-0.bg-error-300.items-center.group-hover_flex.hover_text-gray-200.cursor-pointer(v-if="value", @click="$emit('updateOrDelete')")
        SVGIcon(:svg="isTrash ? 'trash' : 'close'", :size="14")          
</template>