<script setup lang="ts">
import restaurantWorkHours from "@/data/db-work-hours.json";
import restaurantHoursBlock from "@/data/db-hours-blocked.json";
import workHoursAvailable from "@/data/work-hours-available.json";

export interface SelectTimeProps {
    name: 'From' | 'To',
    time: string,
    index: number,
}
const props = defineProps<SelectTimeProps>()

const isDropdownOpen = ref(false);
const toggleDropdown = () => isDropdownOpen.value = !isDropdownOpen.value;

const workHoursList = restaurantWorkHours.lunch.concat(restaurantWorkHours.dinner)
</script>


<template lang="pug">
.flex.items-center.py-2.px-3.gap-1.cursor-pointer.relative(@click="toggleDropdown()")
    p.pr-1.leading-normal.text-xxs.text-grey-200 {{ name }}
    p.leading-normal.text-grey-300 {{ time }}
    SVGIcon.text-grey-300(svg="arrow-down", :size="15")

    //- Dropdown
    .absolute.inset-x-0.top-12.max-h-40.bg-white.rounded-lg.shadow-lg.overflow-y-scroll.z-10(v-show="isDropdownOpen")
        p.py-2.px-3(v-for="t in workHoursList", :key="t", @click="$emit('updateTime', name, t, index)",
            :class="{ 'cursor-not-allowed line-through	bg-gray-50 text-gray-200' : t === time, 'cursor-pointer text-grey-300 hover_bg-gray-100' : t !== time }") {{ t }}
</template>
