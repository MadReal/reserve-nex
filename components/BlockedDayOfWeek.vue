<script setup lang="ts">
export interface SelectDayProps {
    showTrash: boolean,
    isUpdate: boolean // true: add new day - false: update day
    blockedDaysOfWeekList: Block[]
    blockedDay?: Block,
}
const props = defineProps<SelectDayProps>()

const isDropdownOpen = ref(false);
const toggleDropdown = () => isDropdownOpen.value = !isDropdownOpen.value;

const dayIsAlreadyInBlockedDaysList = (dayInt: number) => props.blockedDaysOfWeekList.some((e) => e.dayOfWeek === dayInt);
// if there's a blocked day show the day's name || if there are other blockedDaysOfWeek add 'altro', otherwise empty
const buttonText = computed(() => (props.blockedDay ? useTranslateDayOfWeek(props.blockedDay.dayOfWeek!) : `Seleziona ${props.blockedDaysOfWeekList?.length ? 'altro' : ''} giorno`))
</script>


<template lang="pug">
.flex.items-center.justify-between.mb-2.relative.gap-3
    .flex.items-center.justify-between.grow.py-2.px-3.border.rounded-lg.cursor-pointer.hover_bg-slate-50(@click="toggleDropdown")
        p.leading-normal.text-grey-200.text-sm {{ buttonText }}
        SVGIcon.text-primary-100(svg="arrow-down", :size="15")
        //- Dropdown
        .absolute.inset-x-0.top-12.max-h-40.bg-white.rounded-lg.shadow-lg.overflow-y-scroll.z-10(v-show="isDropdownOpen")
            p.py-2.px-3.text-sm(v-for="dayInt in 7", :key="dayInt", @click="$emit('addOrUpdateDay', blockedDay?.id, dayInt, isUpdate)",
                :class="{ 'cursor-not-allowed line-through	bg-gray-50 text-gray-200' : dayIsAlreadyInBlockedDaysList(dayInt), 'cursor-pointer text-grey-300 hover_bg-gray-100' : !dayIsAlreadyInBlockedDaysList(dayInt) }") 
                | {{ useTranslateDayOfWeek(dayInt) }}

    .w-4
        SVGIcon.text-grey-200.cursor-pointer.hover_text-error-200(svg="trash", :size="15", v-if="showTrash", @click="$emit('removeDay', blockedDay?.id)")
</template>
