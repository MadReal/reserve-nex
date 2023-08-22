<script setup lang="ts">
import _default_workHoursAvailable from "@/data/work-hours-available.json";

export interface SelectWorkHourProps {
    workHours: WorkHour[],
    isLunch: boolean
}

const props = defineProps<SelectWorkHourProps>()
const emit = defineEmits(['addNewTimeSlot', 'removeTimeSlot'])

// put time in order from smallest to highest, except for 00:00 and 00:30, put those last
const workHoursSorted = props.workHours.sort((a, b) => {
    if (a.timeSlot === "00:00" || a.timeSlot === "00:30") return 1; // "00:00" and "00:30" should come last
    if (b.timeSlot === "00:00" || b.timeSlot === "00:30") return -1; // "00:00" and "00:30" should come last
    return parseInt(a.timeSlot) - parseInt(b.timeSlot);
});

const workHoursAvailable = _default_workHoursAvailable[props.isLunch ? 'lunch' : 'dinner']
const isHoursStillAvailableToFill = computed(() => props.workHours.length !== workHoursAvailable.length)

let isSelectVisible = ref(false)
let isDropdownOpen = ref(true)
const toggleSelect = () => isSelectVisible.value = true
const toggleDropdown = () => isDropdownOpen.value = !isDropdownOpen.value

const addTimeSlot = (newTimeSlot: WorkHour['timeSlot']) => {
    emit('addNewTimeSlot', newTimeSlot, props.isLunch)
    isSelectVisible.value = false
    isDropdownOpen.value = false
}
const removeTimeSlot = (timeSlotId: number) => emit('removeTimeSlot', timeSlotId, props.isLunch)
const isTimeUsed = (time: string): boolean => props.workHours.some(workHour => workHour.timeSlot === time)
</script>


<template lang="pug">
div
    //- list of all the workHours
    .flex.items-center.justify-between.border.rounded-lg.py-2.px-3.mb-2(v-for="time in workHoursSorted", :key="time.id")
        p.leading-normal.text-grey-300 {{ time.timeSlot }}
        SVGIcon.text-grey-300.cursor-pointer.hover_text-error-200(svg="trash", :size="15", @click="removeTimeSlot(time.id)")
    //- ADD
    .flex.items-center.justify-between.border.border-dashed.border-primary-100.rounded-lg.py-2.px-3.mb-2.cursor-pointer.hover_bg-slate-50(
        v-if="!isSelectVisible && isHoursStillAvailableToFill", @click="toggleSelect()")
        p.leading-normal.text-primary-100 Aggiungi Orario
        SVGIcon.text-primary-100(svg="plus", :size="15")
    //- SELECT
    .flex.items-center.justify-between.border.border-primary-100.rounded-lg.py-2.px-3.mb-2.relative.cursor-pointer.hover_bg-slate-50(
        v-if="isSelectVisible && isHoursStillAvailableToFill", @click="toggleDropdown()")
        p.leading-normal.text-primary-100 Seleziona Orario
        SVGIcon.text-primary-100(svg="arrow-down", :size="15")
        .absolute.inset-x-0.top-12.max-h-40.bg-white.rounded-lg.shadow-lg.overflow-y-scroll.z-10(v-show="isDropdownOpen")
            p.py-2.px-3(v-for="time in workHoursAvailable", :key="time", @click="addTimeSlot(time)",
                :class="{ 'cursor-not-allowed line-through	bg-gray-50 text-gray-200' : isTimeUsed(time), 'cursor-pointer text-grey-300 hover_bg-gray-100' : !isTimeUsed(time) }") {{ time }}
</template>
