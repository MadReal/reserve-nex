<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import type { DatePickerInstance } from "@vuepic/vue-datepicker"

import { storeToRefs } from 'pinia'
import { useBlocksStore } from '~/store/Blocks'
import { useWorkTimesStore } from '~/store/WorkTime'

const blocksStore = useBlocksStore()
const workTimesStore = useWorkTimesStore();

const { blocksTimePeriodList } = storeToRefs(blocksStore)
const { mergedWorkTimesList } = storeToRefs(workTimesStore)

const formatDate = (date: string) => useDateTimeFormatting(date).formattedDate

// Data Picker dropdown
const dropdownCalendarOpen = ref<number | null>(null);
const toggleDropdownCalendar = (index: number | null) => {
    dropdownCalendarOpen.value = dropdownCalendarOpen.value === index ? null : index;
    // updateBlockTimePeriod()
}
// API CALLS
const addBlockTimePeriod = () => blocksStore.addBlockTimePeriod(mergedWorkTimesList.value[0].time, mergedWorkTimesList.value[mergedWorkTimesList.value.length - 1].time)
const updateBlockTimePeriod = (isTimeFrom: boolean, time: string, index: number) => {
    const block: Block = blocksTimePeriodList.value[index];
    if (isTimeFrom) block.timeFrom = time;
    else block.timeTo = time;

    if (block === null || block.timeTo === null || block.timeFrom === null) return

    if ((isTimeFrom && block.timeTo < time) || (!isTimeFrom && block.timeFrom > time)) {
        block.timeTo = block.timeFrom = time;
    }
    blocksStore.updateBlockTimePeriod(block.id, block.timeFrom, block.timeTo, block.date)
};
</script>


<template lang="pug">
.grid.items-center.justify-between.border.rounded-lg.mb-2(class="grid-cols-[1fr_1fr__1px_2fr_min-content]" v-for="(item, index) in blocksTimePeriodList", :key="item.id")
    //- TIME From / To
    SelectTime(:isTimeFrom="true", :time="item.timeFrom", :blockIndex="index", @updateBlockTimePeriod="updateBlockTimePeriod")
    SelectTime(:isTimeFrom="false", :time="item.timeTo", :blockIndex="index", @updateBlockTimePeriod="updateBlockTimePeriod")
    .h-full.border-r
    //- DATE
    .flex.items-center.py-2.px-3.gap-1.cursor-pointer.relative(@click="toggleDropdownCalendar(index)")
        p.leading-normal.text-grey-300 {{ formatDate(item.date) }}
        //- Dropdown
        .absolute.top-12.left-0.h-fit.bg-white.rounded-lg.shadow-lg.z-10(v-show="dropdownCalendarOpen === index")
            VueDatePicker(v-model="item.date", :month-change-on-scroll="false", :enable-time-picker="false", inline auto-apply, :state="true", @update:model-value="toggleDropdownCalendar(null)")

    .flex.items-center.py-2.px-3
        SVGIcon.text-grey-300.cursor-pointer.hover_text-error-200(svg="trash", :size="15", @click="blocksStore.removeBlock(item.id)")
</template>


<style>
:root {
    --dp-font-family: "Poppins", sans-serif
}
</style>