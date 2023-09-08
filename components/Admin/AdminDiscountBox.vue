<script setup lang="ts">
import { storeToRefs } from 'pinia'

interface AdminDiscountDragProps {
    workTime: WorkTime,
    selectedDayOfWeek: DayOfWeek
}
const props = withDefaults(defineProps<AdminDiscountDragProps>(), {});

const storeDiscounts = useDiscountsStore();
const { discountsList } = storeToRefs(storeDiscounts)

const isDiscountOnEveryDay = computed(() => {
    const filteredList = discountsList.value.filter(obj => obj.workTime.id === props.workTime.id);
    return filteredList.length === 7
})

const discountOnWorkTime = computed(() => discountsList.value.find(item => item.dayOfWeek === props.selectedDayOfWeek && item.workTime.id === props.workTime.id))
const discountAmountOnWorkTime = computed(() => discountOnWorkTime.value?.discountAmount)
const discountAmountOnWorkTimeValue = computed(() => discountOnWorkTime.value?.discountAmount?.value || null)

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

    const discountToCheck = discountOnWorkTime.value
    if (effectAllowed === 'copy') {
        // if the drop is while "all days" is selected
        if (props.selectedDayOfWeek === 10) storeDiscounts.addManyDiscounts(props.selectedDayOfWeek, discountAmountId, workTimeId)
        // otherwise
        else {
            // if you're adding a Discount on WorkTime
            if (!discountId && !discountToCheck) storeDiscounts.addDiscount(props.selectedDayOfWeek, workTimeId, discountAmountId)
            // if you're trying to replace a discountAmount in a workTime with Discount already set
            if (!discountId && discountToCheck) storeDiscounts.updateDiscount(discountToCheck?.id, workTimeId, discountAmountId)
        }
    } else if (effectAllowed === 'move') {
        storeDiscounts.updateDiscount(discountId, workTimeId, discountAmountId)
    }
}
</script>


<template lang="pug">
.relative.pt-3.text-grey-200.rounded.bg-grey-300.flex.items-center.justify-between.flex-col.overflow-hidden(
    class="min-h-[5rem]"
    :class="{ 'bg-transparent text-black border border-dashed border-black' : selectedDayOfWeek === 10, 'text-white' : selectedDayOfWeek !== 10 }")

    .flex.items-center.justify-center
        .mr-1: SVGIcon(svg="clock", :size="14")
        p {{ workTime.time }}

    .w-5.h-5.mb-4.border.border-red-500.rounded-full(v-if="selectedDayOfWeek === 10" class="p-0.5")
        .w-full.h-full.rounded-full(:class="{ 'bg-red-500' : isDiscountOnEveryDay }")

    .absolute.inset-0.z-30(        
        @drop="onDrop($event, workTime.id)",
        @dragenter.prevent, @dragover.prevent)

    AdminDiscountAmount(v-if="selectedDayOfWeek !== 10",
        :value="discountAmountOnWorkTimeValue",
        @updateOrDelete="deleteDiscount(discountOnWorkTime?.id)", 
        @dragstart="startDrag($event, null, discountAmountOnWorkTime?.id, 'copy')"
        @dragleave="leaveDrag()",
        @dragend="endDrag($event, discountOnWorkTime?.id)")
</template>