<script setup lang="ts">
import { storeToRefs } from 'pinia'

interface AdminDiscountDragProps {
    discountAmount: DiscountAmount,
    showTrash?: boolean,
}
const props = withDefaults(defineProps<AdminDiscountDragProps>(), {
    showTrash: false
});
</script>


<template lang="pug">
.relative.h-8.w-full.overflow-hidden.flex.items-center.justify-center.group
    p.bg-red-500.text-white.text-sm.text-center.cursor-grab.bg-red-500.text-white(
        :class="{ 'bg-transparent hover_brightness-125' : !showTrash, 'group-hover_mr-2' : showTrash }") 
        | {{ discountAmount?.value }}%

    .absolute.px-1.hidden.z-10.inset-y-0.right-0.bg-error-300.items-center.group-hover_flex.hover_text-gray-200(v-if="showTrash", @click="deleteDiscountAmount(discountAmount.id)")
        SVGIcon.cursor-pointer(svg="trash", :size="14")    
</template>