<script setup lang="ts">
import _default_workTimesAvailable from "@/data/work-times-available.json";

export interface SelectWorkHourProps {
    workTimes: WorkTime[],
    isLunch: boolean
}
const props = defineProps<SelectWorkHourProps>()
const emit = defineEmits(['addNewTime', 'removeTime'])

const workTimesAvailable = _default_workTimesAvailable[props.isLunch ? 'lunch' : 'dinner']
const isHoursStillAvailableToFill = computed(() => props.workTimes.length !== workTimesAvailable.length)

let isSelectVisible = ref(false)
let isDropdownOpen = ref(true)
const toggleSelect = () => isSelectVisible.value = true
const toggleDropdown = () => isDropdownOpen.value = !isDropdownOpen.value

const addNewTime = (newTime: WorkTime['time']) => {
    emit('addNewTime', newTime, props.isLunch)
    isSelectVisible.value = false
    isDropdownOpen.value = false
}
const removeTime = (timeId: number) => emit('removeTime', timeId)
const isTimeUsed = (time: string): boolean => props.workTimes.some(workTime => workTime.time === time)
</script>


<template lang="pug">
div
    //- list of all the workTimes
    .flex.items-center.justify-between.border.rounded-lg.py-2.px-3.mb-2(v-for="time in workTimes", :key="time.id")
        p.leading-normal.text-grey-300 {{ time.time }}
        SVGIcon.text-grey-300.cursor-pointer.hover_text-error-200(svg="trash", :size="15", @click="removeTime(time.id)")
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
            p.py-2.px-3(v-for="time in workTimesAvailable", :key="time", @click="addNewTime(time)",
                :class="{ 'cursor-not-allowed line-through	bg-gray-50 text-gray-200' : isTimeUsed(time), 'cursor-pointer text-grey-300 hover_bg-gray-100' : !isTimeUsed(time) }") {{ time }}
</template>
