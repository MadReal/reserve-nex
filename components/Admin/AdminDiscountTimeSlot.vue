<script setup lang="ts">
import { storeToRefs } from 'pinia'

interface AdminDiscountDragProps {
    workTime: WorkTime,
    selectedDayOfWeek: DayOfWeek
}
const props = withDefaults(defineProps<AdminDiscountDragProps>(), {});

const storeDiscounts = useDiscountsStore();
storeDiscounts.fetchDiscountAmounts()
storeDiscounts.fetchDiscounts()
const { discountsList } = storeToRefs(storeDiscounts)


const discountOnWorkTime = (workTimeId: WorkTime["id"]) => discountsList.value.find(item => item.dayOfWeek === props.selectedDayOfWeek && item.workTime.id === workTimeId)

const deleteDiscount = (discountId: Discount["id"]) => storeDiscounts.deleteDiscount(discountId)

const dragHasLelt = ref(false)

const startDrag = (event: any, discountId: Discount["id"], discountAmountId: DiscountAmount["id"], effectAllowed: string) => {
    event.dataTransfer.effectAllowed = effectAllowed
    event.dataTransfer.dropEffect = effectAllowed
    event.dataTransfer.setData('discountId', discountId)
    event.dataTransfer.setData('discountAmountId', discountAmountId)
}
const leaveDrag = () => dragHasLelt.value = true
const endDrag = (event: any, discountId: Discount["id"]) => dragHasLelt.value ? deleteDiscount(discountId) : null
const onDrop = (event: any, workTimeId: WorkTime["id"]) => {
    dragHasLelt.value = false
    const effectAllowed = event.dataTransfer.effectAllowed
    const discountId = parseInt(event.dataTransfer.getData('discountId'))
    const discountAmountId = parseInt(event.dataTransfer.getData('discountAmountId'))

    const discountToCheck = discountOnWorkTime(workTimeId)
    if (effectAllowed === 'copy') {
        // if you're adding a Discount on WorkTime
        if (!discountId && !discountToCheck) storeDiscounts.addDiscount(props.selectedDayOfWeek, workTimeId, discountAmountId)
        // if you're trying to replace a discountAmount in a workTime with Discount already set
        if (!discountId && discountToCheck) storeDiscounts.updateDiscount(discountToCheck.id, workTimeId, discountAmountId)
    } else if (effectAllowed === 'move') {
        storeDiscounts.updateDiscount(discountId, workTimeId, discountAmountId)
    }
}
</script>


<template lang="pug">
.relative.pt-3.text-grey-200.rounded.bg-grey-300.flex.items-center.justify-between.flex-col.text-white.overflow-hidden(class="min-h-[5rem]")
    .flex.items-center.justify-center
        .mr-1: SVGIcon(svg="clock", :size="14")
        p {{ workTime.time }}

    .absolute.inset-0(        
        @drop="onDrop($event, workTime.id)",
        @dragenter.prevent, @dragover.prevent,
    )

    .relative.h-8.w-full.overflow-hidden.flex.items-center.justify-center.group.bg-red-500.text-white.text-sm.text-center.z-10(
        draggable="true",
        @dragstart="startDrag($event, discountOnWorkTime(workTime.id)?.id, discountOnWorkTime(workTime.id)?.discountAmount.id,  'move')"
        @dragleave="leaveDrag()",
        @dragend="endDrag($event, discountOnWorkTime(workTime.id)?.id)", 
        @dragenter.prevent, @dragover.prevent,
        :class="{ 'bg-transparent' : !discountOnWorkTime(workTime.id), 'cursor-grab' : discountOnWorkTime(workTime.id) }")

        p(:class="{ 'group-hover_mr-2' : discountOnWorkTime(workTime.id) }") {{ discountOnWorkTime(workTime.id)?.discountAmount?.value }}{{ discountOnWorkTime(workTime.id)?.discountAmount?.value ? '%' : '-' }}

        .absolute.px-1.hidden.z-10.inset-y-0.right-0.bg-error-300.items-center.group-hover_flex.hover_text-gray-200.cursor-pointer(v-if="discountOnWorkTime(workTime.id)", @click="deleteDiscount(discountOnWorkTime(workTime.id)?.id)")
            SVGIcon(svg="close", :size="14")
</template>