<script setup lang="ts">
import { storeToRefs } from 'pinia';

interface ClientBoxWorkTimeProps {
    time: WorkTime["time"],
    isSelected: boolean
    dateSelected: Date
}
const props = withDefaults(defineProps<ClientBoxWorkTimeProps>(), {
    isSelected: false
})
const emit = defineEmits(['selectTime'])


import { useBlocksStore } from '~/stores/Blocks'
import { useDiscountsStore } from '~/stores/Discounts'
const storeBlocks = useBlocksStore()
const storeDiscounts = useDiscountsStore();
const { blockedTimesOnDayList } = storeToRefs(storeBlocks)
const { discountsList } = storeToRefs(storeDiscounts)

const blockedTimesToday = computed(() => {
    // Use .filter() to create a new array with items that have the same date
    const filteredList = blockedTimesOnDayList.value.filter(item => {
        const date = new Date(item.date!);
        date.setHours(0, 0, 0, 0);
        const itemDate = date.toISOString(); // Convert to ISO date for comparison
        return itemDate === props.dateSelected.toISOString();
    });
    return filteredList;
});

// Function to convert time string to minutes
function convertTimeToMinutes(timeString: string) {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
}

// Get the current time as minutes since midnight
const now = new Date();
const currentMinutes = now.getHours() * 60 + now.getMinutes();

// Use the `Array.some()` method to check if `props.time` is within the range of any item
const isTimeBlocked = blockedTimesToday.value.some(item => {
    // Convert time strings to minutes for comparison
    const timeToCheckMinutes = convertTimeToMinutes(props.time);
    const startTimeMinutes = convertTimeToMinutes(item.timeStart!);
    const endTimeMinutes = convertTimeToMinutes(item.timeEnd!);

    // Check if `timeToCheckMinutes` is between `startTimeMinutes` and `endTimeMinutes`
    return timeToCheckMinutes >= startTimeMinutes && timeToCheckMinutes <= endTimeMinutes;
});

// Check if the dateSelected is today and if `props.time` is in the past
const isTimePast = (() => {
    const selectedDate = props.dateSelected;
    const isToday = selectedDate.getDate() === now.getDate() &&
        selectedDate.getMonth() === now.getMonth() &&
        selectedDate.getFullYear() === now.getFullYear();

    // Convert time to minutes for comparison
    const timeToCheckMinutes = convertTimeToMinutes(props.time);

    // Check if the time is between 00:00 and 04:00
    const isBetweenMidnightAnd4AM = timeToCheckMinutes >= 0 && timeToCheckMinutes <= 4 * 60;

    return isToday && !isBetweenMidnightAnd4AM && timeToCheckMinutes < currentMinutes;
})();

const discountAmountOnTime = computed(() => discountsList.value.find(item => item.workTime.time === props.time)?.discountAmount?.value)

function selectTime(time: string) {
    if (isTimeBlocked) return
    else emit('selectTime', time, discountAmountOnTime.value)
}
</script>


<template lang="pug">
.px-2.rounded-lg.border.border-gray-100.text-grey-200.hover_border-primary-100.flex.items-center.flex-col.justify-center.group(
    class="min-h-[4rem]"
    :class="{ 'border-primary-100' : isSelected, 'cursor-not-allowed line-through decoration-grey-100 text-grey-100 hover_border-gray-100' : isTimeBlocked || isTimePast, 'cursor-pointer' : !isTimeBlocked }",
    @click="selectTime(time)")

    .flex.items-center.justify-center.group-hover_text-primary-100(
        :class="{ 'text-primary-100' : isSelected, 'cursor-not-allowed text-grey-100 hover_text-grey-100' : isTimeBlocked || isTimePast}")
        SVGIcon.mr-1(svg="clock", :size="15")
        p {{ time }}             

    .h-5.px-1.flex.items-center.justify-center.rounded-sm.bg-red-500.text-white.text-sm.text-center.whitespace-nowrap(v-if="discountAmountOnTime")
        p.text-xs #[span(class="text-[9px] tracking-tight relative -top-px") Sconto] {{ discountAmountOnTime }}%
</template>
