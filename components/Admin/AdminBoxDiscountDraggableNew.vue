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


const discountOnWorkTime = computed(() => {
    return discountsList.value.find(item => item.dayOfWeek === props.selectedDayOfWeek && item.workTime.id === props.workTime.id)
})
// const discountOnWorkTime = ref<Discount[]>([]) // Use a ref instead of a computed property
// // Update discountOnWorkTime when discountsList or selectedDayOfWeek changes
// watch([discountsList, () => props.selectedDayOfWeek], ([newDiscountsList]) => {
//     discountOnWorkTime.value = newDiscountsList.filter(
//         item =>
//             item.dayOfWeek === props.selectedDayOfWeek &&
//             item.workTime.id === props.workTime.id
//     )
// })

async function addOrUpdateDiscount(e: any) {
    const discountAmount = e.added.element
    emit('addDiscount', discountAmount.id, props.workTime)
}

function removeItem(e: any) {
    const discount = e.item.classList
    const idClass = Array.from(discount).filter(className => /^id_/.test(className as string))[0];
    if (idClass) {
        const discountId = (idClass as string).replace(/^id_/, ''); // Remove "id_" prefix
        storeDiscounts.deleteDiscount(parseInt(discountId))
    }
}

const allowDrop = (event: any) => {
    console.log(event);
}
const drop = (event: any) => {
    console.log(event);
}
</script>


<template lang="pug">
.pt-3.text-grey-200.rounded.bg-grey-300.flex.items-center.justify-between.flex-col.text-white.overflow-hidden(class="min-h-[5rem]")
    .flex.items-center.justify-center
        .mr-1: SVGIcon(svg="clock", :size="14")
        p {{ workTime.time }}

    AdminDiscountDrag(:discountAmount="discountOnWorkTime", @drop="drop" @dragover="allowDrop")
</template>

<style lang="sass">
.sortable-ghost
    .trash
        display: block
</style>