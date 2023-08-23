<script setup lang="ts">
import dbRestaurantHoursBlock from "@/data/db-hours-blocked.json";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import type { DatePickerInstance } from "@vuepic/vue-datepicker"

// @ts-ignore
const workTimes: WorkTime[] = await useFetchWorkHours() || []; // Provide an empty array as a default value
const lunchWorkTimes = useSortWorkTimes(workTimes.filter((item: WorkTime) => item.mealType === "LUNCH"));
const dinnerWorkTimes = useSortWorkTimes(workTimes.filter((item: WorkTime) => item.mealType === "DINNER"));

const formatDate = (date: string) => useDateTimeFormatting(date).formattedDate
// Logics for setting up time
const restaurantHoursBlock = ref(dbRestaurantHoursBlock);
const updateTime = (key: 'From' | 'To', time: string, index: number) => {
    const block = restaurantHoursBlock.value[index];

    if (key === 'From') block.time_start = time;
    else if (key === 'To') block.time_end = time;

    if ((key === 'From' && block.time_end < time) || (key === 'To' && block.time_start > time)) {
        block.time_end = block.time_start = time;
    }
};
// Data Picker dropdown
const dropdownCalendarOpen = ref<number | null>(null);
const toggleDropdownCalendar = (index: number | null) => dropdownCalendarOpen.value = dropdownCalendarOpen.value === index ? null : index;
// TODO: create new hour block
const addHourBlock = () => restaurantHoursBlock.value.push({
    "id": Math.random(),
    "date": new Date().toDateString(),
    "time_start": lunchWorkTimes[0].time,
    "time_end": dinnerWorkTimes[dinnerWorkTimes.length - 1].time,
});
const removeHourBlock = (index: number) => restaurantHoursBlock.value.splice(index, 1)
</script>


<template lang="pug">
.page
    PageTitle(title="Blocco Orari")

    .grid.gap-6(class="grid-cols-[2fr_1px_1fr]")
        div.mb-8
            .grid.items-center.justify-between.border.rounded-lg.mb-2(class="grid-cols-[1fr_1fr__1px_2fr_min-content]" v-for="(item, index) in restaurantHoursBlock", :key="item.id")
                //- TIME From / To
                SelectTime(slot="From", :time="item.time_start", :index="index", @updateTime="updateTime")
                SelectTime(slot="To", :time="item.time_end", :index="index", @updateTime="updateTime")
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

            //- Empty Row - Add Hour Block
            .flex.items-center.justify-between.border.border-dashed.border-grey-100.rounded-lg.py-2.px-3.mb-2.cursor-pointer.hover_bg-slate-50(@click="addHourBlock()")
                p.leading-normal.text-grey-200 Aggiungi Blocco
                SVGIcon.text-grey-300(svg="plus", :size="15")
</template>


<style>
:root {
    --dp-font-family: "Poppins", sans-serif
}
</style>