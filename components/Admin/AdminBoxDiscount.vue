<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDiscountsStore } from '@/stores/Discounts';

interface BoxReservationProps {
    selectedDayOfWeek: number,
    workTime: WorkTime,
}
const props = defineProps<BoxReservationProps>()
const emit = defineEmits(['addDiscount'])

const storeDiscounts = useDiscountsStore();
const { discountAmountsListOrdered, discountsList } = storeToRefs(storeDiscounts)

// const discountOnWorkTime = computed(() => {
//     return discountsList.value.filter(item => item.dayOfWeek === props.selectedDayOfWeek).filter(item => item.workTime.id === props.workTime.id)

// })
const discountOnWorkTime = computed({
    get: () => {
        const lol = discountsList.value.filter(item => item.dayOfWeek === props.selectedDayOfWeek).filter(item => item.workTime.id === props.workTime.id)
        if (lol.length) {
            console.log(lol[0].value);
            return lol[0].discountAmountId
        }
        else return null
    },
    set: (discountAmount) => {
        if (discountAmount) emit('addDiscount', discountAmount, props.workTime)
        else {
            console.log('empty');

        }
    }
});

// function removeItem(e: any) {
//     storeDiscounts.deleteDiscount(parseInt(discountId))
// }
</script>


<template lang="pug">
.py-3.px-2.text-grey-200.rounded-lg.border.border-gray-100.flex.items-center.justify-center.flex-col(class="min-h-[5rem]")
    .flex.items-center.justify-center.mb-1
        .mr-1: SVGIcon(svg="clock", :size="14")
        p {{ workTime.time }}

    select.w-full.h-7.rounded.text-sm.text-center.border.text-grey-100(
        v-model="discountOnWorkTime", :class="{ 'bg-red-500 text-white' : discountOnWorkTime }")        
        option(:value="null") -
        option(v-for="discountAmount in discountAmountsListOrdered", :key="discountAmount", :value="discountAmount.id") {{ discountAmount.value }}%
</template>