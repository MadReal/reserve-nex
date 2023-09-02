<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'
import { storeToRefs } from 'pinia'
import { useWorkTimesStore } from '~/stores/WorkTimes'

interface SelectTimeProps {
    isTimeFrom: boolean,
    time: string,
}
const props = defineProps<SelectTimeProps>()

const storeWorkTimes = useWorkTimesStore();
const { workTimesListsMerged } = storeToRefs(storeWorkTimes)

const isDropdownOpen = ref(false);
const toggleDropdown = () => isDropdownOpen.value = !isDropdownOpen.value;
const closeDropdown = () => { if (isDropdownOpen.value) toggleDropdown() }
</script>


<template lang="pug">
.flex.items-center.py-2.px-2.lg_px-3.gap-1.cursor-pointer.relative(@click="toggleDropdown()")
    p.pr-1.leading-normal.text-xxs.text-grey-200 {{ isTimeFrom ? 'From' : 'To' }}
    p.leading-normal.text-grey-300 {{ time }}
    SVGIcon.text-grey-300(svg="arrow-down", :size="15")

    //- Dropdown
    .absolute.inset-x-0.top-12.max-h-40.bg-white.rounded-lg.shadow-lg.overflow-y-scroll.z-10(v-show="isDropdownOpen", v-on-click-outside="closeDropdown")
        p.py-2.px-3(v-for="workTime in workTimesListsMerged", :key="workTime.id", @click="$emit('updateBlockedTimeOnDay', isTimeFrom, workTime.time)",
            :class="{ 'cursor-not-allowed line-through	bg-gray-50 text-gray-200' : workTime === time, 'cursor-pointer text-grey-300 hover_bg-gray-100' : workTime.time !== time }") {{ workTime.time }}
</template>