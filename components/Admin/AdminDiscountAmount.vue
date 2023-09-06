<script setup lang="ts">
import { storeToRefs } from 'pinia'

interface Props {
    discountAmount: DiscountAmount
    selectedDayOfWeek: number
    isDelete?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    isDelete: true
})

const emit = defineEmits(['deleteDiscountAmount', 'updateDiscountAmount'])

const storeDiscounts = useDiscountsStore();
storeDiscounts.fetchDiscountAmounts()
storeDiscounts.fetchDiscounts()
const { discountsList } = storeToRefs(storeDiscounts)

const discountOnWorkTime = (workTimeId: WorkTime["id"]) => discountsList.value.find(item => item.dayOfWeek === props.selectedDayOfWeek && item.workTime.id === workTimeId)

function handleDeleteOrClick() {
    props.isDelete ? emit('deleteDiscountAmount', props.discountAmount.id) : emit('updateDiscountAmount', props.discountAmount.id)
}
</script>


<template lang="pug">
.relative.rounded.h-8.w-full.overflow-hidden.flex.items-center.justify-center.bg-red-500.text-white.text-sm.text-center.cursor-grab.group
    p.group-hover_mr-2 {{ discountAmount.value }}{{ discountOnWorkTime(workTime.id)?.discountAmount?.value ? '%' : '-' }}

    .absolute.px-1.hidden.z-10.inset-y-0.right-0.bg-error-300.items-center.group-hover_flex.hover_text-gray-200.cursor-pointer(@click="handleDeleteOrClick()")
        SVGIcon(:svg="isDelete ? 'trash' : 'close'", :size="14")        
</template>