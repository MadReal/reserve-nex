<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDiscountsStore } from '@/stores/Discounts';
import Draggable from 'vuedraggable'
// https://okamuuu.com/posts/xjni9lf5h for SWAP

interface BoxReservationProps {
    selectedDayOfWeek: number,
    workTime: WorkTime,
}
const props = defineProps<BoxReservationProps>()
const emit = defineEmits(['addDiscount'])

const storeDiscounts = useDiscountsStore();
const { discountsList } = storeToRefs(storeDiscounts)

// const discountOnWorkTime = computed(() => {
//     return discountsList.value.filter(item => item.dayOfWeek === props.selectedDayOfWeek).filter(item => item.workTime.id === props.workTime.id)
// })
const discountOnWorkTime = ref<Discount[]>([]) // Use a ref instead of a computed property
// Update discountOnWorkTime when discountsList or selectedDayOfWeek changes
watch([discountsList, () => props.selectedDayOfWeek], ([newDiscountsList]) => {
    discountOnWorkTime.value = newDiscountsList.filter(
        item =>
            item.dayOfWeek === props.selectedDayOfWeek &&
            item.workTime.id === props.workTime.id
    )
})

async function change(e: any) {
    const discountAmount = e.added.element
    emit('addDiscount', discountAmount, props.workTime)
}

function removeItem(e: any) {
    const discount = e.item.classList
    const idClass = Array.from(discount).filter(className => /^id_/.test(className as string))[0];
    if (idClass) {
        const discountId = (idClass as string).replace(/^id_/, ''); // Remove "id_" prefix
        storeDiscounts.deleteDiscount(parseInt(discountId))
    }
}
</script>


<template lang="pug">
.h-20.py-3.px-1.text-grey-200.rounded-lg.border.border-gray-100
    .flex.items-center.justify-center.mb-2
        .mr-1: SVGIcon(svg="clock", :size="14")
        p {{ workTime.time }}

    Draggable.relative(v-model="discountOnWorkTime" group="universalGroup", itemKey="id", :sort="false", 
        :swap="true", swapClass="highlight", @change="change", :removeOnSpill="true", :onSpill="removeItem")        
        template(#item="{ element }")
            p.h-7.p-1.rounded.bg-red-500.text-white.text-sm.text-center.cursor-grab(:class="'id_'+element.id") {{ element.value }}%
        template(#footer)
            .trash.hidden.bg-white.p-2.absolute.rounded-full.-top-2.right-0
                SVGIcon(svg="trash", :size="14")
</template>

<style lang="sass">
.sortable-ghost
    .trash
        display: block
</style>