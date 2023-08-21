<script setup lang="ts">
import dbRestaurantHoursBlock from "@/data/db-hours-blocked.json";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import type { DatePickerInstance } from "@vuepic/vue-datepicker"

const formatDate = (date: string) => useDateTimeFormatting(date).formattedDate

const restaurantHoursBlock = ref(dbRestaurantHoursBlock);
const updateTime = (key: 'From' | 'To', time: string, index: number) => {
    const block = restaurantHoursBlock.value[index];

    if (key === 'From') block.time_start = time;
    else if (key === 'To') block.time_end = time;

    if ((key === 'From' && block.time_end < time) || (key === 'To' && block.time_start > time)) {
        block.time_end = block.time_start = time;
    }
};


const isDropdownCalendarOpen = ref(false);
const toggleDropdownCalendar = () => isDropdownCalendarOpen.value = !isDropdownCalendarOpen.value;

const date = ref();
const handleDate = (modelData: any) => {
    date.value = modelData;
    toggleDropdownCalendar()
}
</script>


<template lang="pug">
.page
    PageTitle(title="Blocco Orari")

    .grid.gap-6(class="grid-cols-[2fr_1px_1fr]")
        div.mb-8
            .grid.items-center.justify-between.border.rounded-lg.mb-2(class="grid-cols-[1fr_1fr__1px_2fr_min-content]" v-for="(item, index) in restaurantHoursBlock", :key="item.id")
                //- TIME From / To
                SelectTime(name="From", :time="item.time_start", :index="index", @updateTime="updateTime")
                SelectTime(name="To", :time="item.time_end", :index="index", @updateTime="updateTime")
                //- Divider
                .h-full.border-r

                //- DATE
                .flex.items-center.py-2.px-3.gap-1.cursor-pointer.relative(@click="toggleDropdownCalendar")
                    p.leading-normal.text-grey-300 {{ formatDate(item.date) }}
                    //- Dropdown
                    .absolute.top-12.left-0.h-fit.bg-white.rounded-lg.shadow-lg.z-10(v-show="isDropdownCalendarOpen")
                        VueDatePicker(v-model="item.date", :enable-time-picker="false", inline auto-apply, @update:model-value="handleDate")

                .flex.items-center.py-2.px-3
                    SVGIcon.text-grey-300.cursor-pointer.hover_text-error-200(svg="trash", :size="15", @click="removeTimeSetLunch(index)")
</template>


<style>
:root {
    --dp-font-family: "Poppins", sans-serif
}
</style>