<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { vOnClickOutside } from '@vueuse/components'

import { useBlocksStore } from '~/stores/Blocks'

interface SelectTimePeriodProps {
    blockTimePeriod: Block,
}
const props = defineProps<SelectTimePeriodProps>()

const storeBlocks = useBlocksStore()

const disabledDates = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

    const disabledDatesArray = [];
    for (let i = new Date(0); i < today; i.setDate(i.getDate() + 1)) {
        disabledDatesArray.push(new Date(i));
    }
    return disabledDatesArray;
});

// API CALLS
const updateTimeSlot = (isTimeFrom: boolean, time: string) => {
    const block: Block = props.blockTimePeriod
    if (isTimeFrom) block.timeStart = time;
    else block.timeEnd = time;

    // exit function if nulls
    if (block === null || block.timeEnd === null || block.timeStart === null) return

    if ((isTimeFrom && block.timeEnd < time) || (!isTimeFrom && block.timeStart > time)) block.timeEnd = block.timeStart = time;
    updateBlockedTimeRangeOnDate()
};

const updateBlockedTimeRangeOnDate = () => {
    storeBlocks.updateBlockedTimeRangeOnDate(props.blockTimePeriod.id, props.blockTimePeriod.timeStart, props.blockTimePeriod.timeEnd, props.blockTimePeriod.date)
};

// Data Picker dropdown
const isDropdownCalendarOpen = ref(false);
const toggleDropdownCalendar = () => {
    isDropdownCalendarOpen.value = !isDropdownCalendarOpen.value
    updateBlockedTimeRangeOnDate()
}
const closeDropdownCalendar = () => { if (isDropdownCalendarOpen.value) isDropdownCalendarOpen.value = false }
</script>


<template lang="pug">
.grid.items-center.justify-between.border.rounded-lg.mb-2(class="grid-cols-[1fr_1fr__1px_3fr_min-content]", v-on-click-outside="closeDropdownCalendar")
    //- TIME From / To
    AdminTimeRangeSelect(:isTimeFrom="true", :time="blockTimePeriod.timeStart", @updateBlockedTimeRangeOnDate="updateTimeSlot")
    AdminTimeRangeSelect(:isTimeFrom="false", :time="blockTimePeriod.timeEnd", @updateBlockedTimeRangeOnDate="updateTimeSlot")
    .h-full.border-r
    //- DATE
    .flex.items-center.py-2.px-2.lg_px-3.gap-1.cursor-pointer.relative(@click="toggleDropdownCalendar()")
        p.leading-normal.text-grey-300 {{ useDateFormatting(blockTimePeriod.date) }}
        //- Dropdown
        .absolute.top-12.right-0.lg_right-auto.lg_left-0.h-fit.bg-white.rounded-lg.shadow-lg.z-10(v-show="isDropdownCalendarOpen")
            VueDatePicker(v-model="blockTimePeriod.date", locale="it", :month-change-on-scroll="false", :enable-time-picker="false", 
                inline auto-apply, :state="true", @update:model-value="toggleDropdownCalendar()", :disabled-dates="disabledDates")

    .flex.items-center.py-2.px-2.lg_px-3
        SVGIcon.text-grey-300.cursor-pointer.hover_text-error-200(svg="trash", :size="15", @click="storeBlocks.removeBlock(blockTimePeriod.id)")
</template>


<style>
:root {
    --dp-font-family: "Poppins", sans-serif
}
</style>