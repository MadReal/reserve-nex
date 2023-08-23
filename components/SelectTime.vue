<script setup lang="ts">
import restaurantWorkHours from "@/data/db-work-times.json";

export interface SelectTimeProps {
    slot: 'From' | 'To',
    time: string,
    index: number,
}
const props = defineProps<SelectTimeProps>()

// @ts-ignore
const workTimes: WorkTime[] = await useFetchWorkHours() || []; // Provide an empty array as a default value
const workTimesSorted: WorkTime[] = useSortWorkTimes(workTimes)

const isDropdownOpen = ref(false);
const toggleDropdown = () => isDropdownOpen.value = !isDropdownOpen.value;

const workTimesList = restaurantWorkHours.lunch.concat(restaurantWorkHours.dinner)
</script>


<template lang="pug">
.flex.items-center.py-2.px-3.gap-1.cursor-pointer.relative(@click="toggleDropdown()")
    p.pr-1.leading-normal.text-xxs.text-grey-200 {{ slot }}
    p.leading-normal.text-grey-300 {{ time }}
    SVGIcon.text-grey-300(svg="arrow-down", :size="15")

    //- Dropdown
    .absolute.inset-x-0.top-12.max-h-40.bg-white.rounded-lg.shadow-lg.overflow-y-scroll.z-10(v-show="isDropdownOpen")
        p.py-2.px-3(v-for="t in workTimesSorted", :key="t.id", @click="$emit('updateTime', slot, t, index)",
            :class="{ 'cursor-not-allowed line-through	bg-gray-50 text-gray-200' : t === time, 'cursor-pointer text-grey-300 hover_bg-gray-100' : t.time !== time }") {{ t.time }}
</template>
