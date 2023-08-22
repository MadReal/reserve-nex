<script setup lang="ts">
import weekDaysAvailable from "@/data/week-days-available.json";

export interface SelectDayProps {
    restaurantWeekDaysBlocked: { id: number, day_name: string }[],
    showTrash: boolean,
    isUpdate: boolean // true: add new day - false: update day
    blockedDay?: { id: number, day_name: string },
}
const props = defineProps<SelectDayProps>()

const isDropdownOpen = ref(false);
const toggleDropdown = () => isDropdownOpen.value = !isDropdownOpen.value;

const isDayBlocked = (day: string) => props.restaurantWeekDaysBlocked.some((e) => e.day_name === day);
</script>


<template lang="pug">
.flex.items-center.justify-between.mb-2.relative.gap-3
    .flex.items-center.justify-between.grow.py-2.px-3.border.rounded-lg.cursor-pointer.hover_bg-slate-50(@click="toggleDropdown")
        p.leading-normal.text-grey-200.text-sm {{ props.blockedDay?.day_name || `Seleziona ${!showTrash ? 'altro' : ''} giorno` }}
        SVGIcon.text-primary-100(svg="arrow-down", :size="15")
        //- Dropdown
        .absolute.inset-x-0.top-12.max-h-40.bg-white.rounded-lg.shadow-lg.overflow-y-scroll.z-10(v-show="isDropdownOpen")
            p.py-2.px-3(v-for="day in weekDaysAvailable", :key="day", @click="$emit('addOrUpdateDay', props.blockedDay?.day_name, day, isUpdate)",
                :class="{ 'cursor-not-allowed line-through	bg-gray-50 text-gray-200' : isDayBlocked(day), 'cursor-pointer text-grey-300 hover_bg-gray-100' : !isDayBlocked(day) }") {{ day }}

    .w-4
        SVGIcon.text-grey-200.cursor-pointer.hover_text-error-200(svg="trash", :size="15", v-if="showTrash", @click="$emit('removeDay', props.blockedDay?.day_name)")
</template>
