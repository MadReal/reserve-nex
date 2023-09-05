<script setup lang="ts">
import { storeToRefs } from 'pinia'

interface AdminDiscountDragProps {
    item: Discount | DiscountAmount,
    showTrash?: boolean,
}
const props = withDefaults(defineProps<AdminDiscountDragProps>(), {
    showTrash: false
});

const value = computed(() => {
    if ('value' in props.item && props.item.value) {
        return props.item.value;
    } else if ('discountAmount' in props.item && props.item.discountAmount?.id) {
        return props.item.discountAmount.id;
    } else {
        return 0;
    }
})
</script>


<template lang="pug">
.relative.h-8.w-full.overflow-hidden.flex.items-center.justify-center.group(draggable="true", @dragenter.prevent, @dragover.prevent)
    p.bg-red-500.text-white.text-sm.text-center.cursor-grab.bg-red-500.text-white(
        :class="{ 'bg-transparent hover_brightness-125' : !showTrash, 'group-hover_mr-2' : showTrash }") 
        //- | {{ item?.value }}% {{  value }}
        | {{  value }}

    .absolute.px-1.hidden.z-10.inset-y-0.right-0.bg-error-300.items-center.group-hover_flex.hover_text-gray-200(v-if="showTrash", @click="deleteDiscountAmount(item.id)")
        SVGIcon.cursor-pointer(svg="trash", :size="14")    
</template>