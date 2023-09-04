<script setup lang="ts">
import { storeToRefs } from 'pinia'

interface BoxReservationProps {
    selectedDayOfWeek: number,
    workTime: WorkTime,
}
const props = defineProps<BoxReservationProps>()

import { useDiscountsStore } from '@/stores/Discounts';
const storeDiscounts = useDiscountsStore();
const { discountAmountsListOrdered, discountsList } = storeToRefs(storeDiscounts)

function findDiscount() {
    return discountsList.value.find(item => item.dayOfWeek === props.selectedDayOfWeek && item.workTime.id === props.workTime.id)
}

let discountOnWorkTimeId = ref<number | null>()
const discountAmountId = computed({
    get: () => {
        const discount = findDiscount()
        return discount ? discount.discountAmountId : null
    },
    set: (newDiscountAmountId) => {
        // create
        if (newDiscountAmountId && !discountOnWorkTimeId.value) {
            storeDiscounts.addDiscount(props.selectedDayOfWeek, newDiscountAmountId, props.workTime)
        }
        // update
        if (newDiscountAmountId && discountOnWorkTimeId.value) {
            storeDiscounts.updateDiscount(newDiscountAmountId, props.workTime.id, discountOnWorkTimeId.value)
        }
        // delete
        if (newDiscountAmountId === null && discountOnWorkTimeId.value) {
            storeDiscounts.deleteDiscount(discountOnWorkTimeId.value)
            discountOnWorkTimeId.value = null
        }
    }
});
watch(discountsList, () => {
    const discount = findDiscount()
    if (discount) discountOnWorkTimeId.value = discount.id
    else discountOnWorkTimeId.value = null
});
</script>


<template lang="pug">
//- .py-3.px-2.text-grey-200.rounded-lg.border.border-gray-100.flex.items-center.justify-center.flex-col(class="min-h-[5rem]")
.pt-3.text-grey-200.rounded.bg-grey-300.flex.items-center.justify-between.flex-col.text-white.overflow-hidden(class="min-h-[5rem]")
    .flex.items-center.justify-center.px-1
        .mr-1: SVGIcon(svg="clock", :size="14")
        p {{ workTime.time }}

    select.w-full.h-8.text-sm.text-center.text-grey-100.focus_outline-none.cursor-pointer(
        v-model="discountAmountId", :class="{ 'bg-red-500 text-white' : discountAmountId, 'bg-transparent hover_brightness-125' : !discountAmountId }")        
        option(:value="null") -
        option(v-for="discountAmount in discountAmountsListOrdered", :key="discountAmount.id", :value="discountAmount.id") {{ discountAmount.value }}%
</template>