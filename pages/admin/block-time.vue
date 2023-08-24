<script setup lang="ts">
import dbRestaurantHoursBlock from "@/data/db-hours-blocked.json";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import type { DatePickerInstance } from "@vuepic/vue-datepicker"

import { storeToRefs } from 'pinia'
import { useBlocksStore } from '~/store/Blocks'
import { useWorkTimesStore } from '~/store/WorkTime'

const blocksStore = useBlocksStore()
const workTimesStore = useWorkTimesStore();

const { blocksWorkTimeOnDateList } = storeToRefs(blocksStore)
const { mergedWorkTimesList } = storeToRefs(workTimesStore)

onMounted(async () => {
    await workTimesStore.fetchWorkTimes()
    await blocksStore.fetchBlocksWorkTimeOnDateList()
});

const formatDate = (date: string) => useDateTimeFormatting(date).formattedDate

const updateTime = (isTimeFrom: boolean, time: string, index: number) => {
    const block = blocksWorkTimeOnDateList.value[index];
    if (isTimeFrom) block.timeFrom = time;
    else block.timeTo = time;

    if (block === null || block.timeTo === null || block.timeFrom === null) return

    if ((isTimeFrom && block.timeTo < time) || (!isTimeFrom && block.timeFrom > time)) {
        block.timeTo = block.timeFrom = time;
    }
    blocksStore.updateBlockWorkTimeOnDateList(block.id, block.timeFrom, block.timeTo, block.date)
};
// // Data Picker dropdown
const dropdownCalendarOpen = ref<number | null>(null);
const toggleDropdownCalendar = (index: number | null) => {
    dropdownCalendarOpen.value = dropdownCalendarOpen.value === index ? null : index;
    // updateTime()
}
// // TODO: create new hour block
// const addHourBlock = () => restaurantHoursBlock.value.push({
//     "id": Math.random(),
//     "date": new Date().toDateString(),
//     "time_start": mergedWorkTimesList.value[0].time,
//     "time_end": mergedWorkTimesList.value[mergedWorkTimesList.value.length - 1].time,
// });
// const removeHourBlock = (index: number) => restaurantHoursBlock.value.splice(index, 1)
</script>


<template lang="pug">
.page
    PageTitle(title="Blocco Orari")

    .grid.gap-6(class="grid-cols-[2fr_1px_1fr]")
        div.mb-8
            .grid.items-center.justify-between.border.rounded-lg.mb-2(class="grid-cols-[1fr_1fr__1px_2fr_min-content]" v-for="(item, index) in blocksWorkTimeOnDateList", :key="item.id")
                //- TIME From / To
                SelectTime(:isTimeFrom="true", :blockTime="item.timeFrom", :blockIndex="index", @updateTime="updateTime")
                SelectTime(:isTimeFrom="false", :blockTime="item.timeTo", :blockIndex="index", @updateTime="updateTime")
                //- Divider
                .h-full.border-r
                //- DATE
                .flex.items-center.py-2.px-3.gap-1.cursor-pointer.relative(@click="toggleDropdownCalendar(index)")
                    p.leading-normal.text-grey-300 {{ formatDate(item.date) }}
                    //- Dropdown
                    .absolute.top-12.left-0.h-fit.bg-white.rounded-lg.shadow-lg.z-10(v-show="dropdownCalendarOpen === index")
                        VueDatePicker(v-model="item.date", :month-change-on-scroll="false", :enable-time-picker="false", inline auto-apply, :state="true", @update:model-value="toggleDropdownCalendar(null)")

                .flex.items-center.py-2.px-3
                    SVGIcon.text-grey-300.cursor-pointer.hover_text-error-200(svg="trash", :size="15", @click="removeHourBlock(index)")

                //- //- Empty Row - Add Hour Block
                //- .flex.items-center.justify-between.border.border-dashed.border-grey-100.rounded-lg.py-2.px-3.mb-2.cursor-pointer.hover_bg-slate-50(@click="addHourBlock()")
                //-     p.leading-normal.text-grey-200 Aggiungi Blocco
                //-     SVGIcon.text-grey-300(svg="plus", :size="15")
</template>


<style>
:root {
    --dp-font-family: "Poppins", sans-serif
}
</style>