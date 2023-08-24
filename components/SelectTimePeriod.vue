<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import type { DatePickerInstance } from "@vuepic/vue-datepicker"
import { useBlocksStore } from '~/store/Blocks'


export interface SelectTimePeriodProps {
    blockTimePeriod: Block,
}
const props = defineProps<SelectTimePeriodProps>()

const blocksStore = useBlocksStore()
const formatDate = (date: string) => useDateTimeFormatting(date).formattedDate

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
    if (isTimeFrom) block.timeFrom = time;
    else block.timeTo = time;

    // exits function if nulls
    if (block === null || block.timeTo === null || block.timeFrom === null) return

    if ((isTimeFrom && block.timeTo < time) || (!isTimeFrom && block.timeFrom > time)) {
        block.timeTo = block.timeFrom = time;
    }
    updateBlockTimePeriod()
};

const updateBlockTimePeriod = () => {
    blocksStore.updateBlockTimePeriod(props.blockTimePeriod.id, props.blockTimePeriod.timeFrom, props.blockTimePeriod.timeTo, props.blockTimePeriod.date)
};

// Data Picker dropdown
const isDropdownCalendarOpen = ref(false);
const toggleDropdownCalendar = () => {
    isDropdownCalendarOpen.value = !isDropdownCalendarOpen.value
    updateBlockTimePeriod()
}

</script>


<template lang="pug">
.grid.items-center.justify-between.border.rounded-lg.mb-2(class="grid-cols-[1fr_1fr__1px_2fr_min-content]")
    //- TIME From / To
    SelectTime(:isTimeFrom="true", :time="blockTimePeriod.timeFrom", @updateBlockTimePeriod="updateTimeSlot")
    SelectTime(:isTimeFrom="false", :time="blockTimePeriod.timeTo", @updateBlockTimePeriod="updateTimeSlot")
    .h-full.border-r
    //- DATE
    .flex.items-center.py-2.px-3.gap-1.cursor-pointer.relative(@click="toggleDropdownCalendar()")
        p.leading-normal.text-grey-300 {{ formatDate(blockTimePeriod.date) }}
        //- Dropdown
        .absolute.top-12.left-0.h-fit.bg-white.rounded-lg.shadow-lg.z-10(v-show="isDropdownCalendarOpen")
            VueDatePicker(v-model="blockTimePeriod.date", :month-change-on-scroll="false", :enable-time-picker="false", 
                inline auto-apply, :state="true", @update:model-value="toggleDropdownCalendar()"
                :disabled-dates="disabledDates")

    .flex.items-center.py-2.px-3
        SVGIcon.text-grey-300.cursor-pointer.hover_text-error-200(svg="trash", :size="15", @click="blocksStore.removeBlock(blockTimePeriod.id)")
</template>


<style>
:root {
    --dp-font-family: "Poppins", sans-serif
}
</style>