<script setup lang="ts">
import restaurantWorkHours from "@/data/db-work-hours.json";
import workHoursAvailable from "@/data/work-hours-available.json";

// Define a constant for the imported data
const restaurantLunchHours = ref(restaurantWorkHours.lunch);
// lunch
let showSelectLunch = ref(false)
const isHoursLunchAvailable = computed(() => restaurantLunchHours.value.length !== workHoursAvailable.lunch.length)
let isDropdownOpenLunch = ref(true)
const toggleSelectLunch = () => { showSelectLunch.value = true }
const toggleDropdownLunch = () => isDropdownOpenLunch.value = !isDropdownOpenLunch.value;
const addTimeSetLunch = (newTime: string) => {
    restaurantLunchHours.value.push(newTime)
    restaurantLunchHours.value.sort((a, b) => parseInt(a) - parseInt(b));
    showSelectLunch.value = false
    isDropdownOpenLunch.value = false
}
const removeTimeSetLunch = (index: number) => restaurantLunchHours.value.splice(index, 1);
const isTimeUsed = (time: string): boolean => restaurantWorkHours.lunch.includes(time);

// dinner
</script>


<template lang="pug">
.page
    PageTitle(title="Gestione Orari")

    .grid(class="grid-cols-[1fr_1px_1fr]").gap-6.border-b
        //- Lunch
        div.mb-6
            p.mb-4 Lunch
            //- TIME LIST
            .flex.items-center.justify-between.border.rounded.py-2.px-3.mb-2(v-for="(time, index) in restaurantLunchHours", :key="time")
                p.leading-normal.text-grey-300 {{ time }}
                SVGIcon.text-grey-300.cursor-pointer.hover_text-error-200(svg="trash", :size="15", @click="removeTimeSetLunch(index)")
            //- AGGIUNGI ORARIO
            .flex.items-center.justify-between.border.border-dashed.border-primary-100.rounded.py-2.px-3.mb-2.cursor-pointer.hover_bg-slate-50(
                v-if="!showSelectLunch && isHoursLunchAvailable", @click="toggleSelectLunch")
                p.leading-normal.text-primary-100 Aggiungi Orario
                SVGIcon.text-primary-100(svg="plus", :size="15")
            //- SELECT TIME
            .flex.items-center.justify-between.border.border-primary-100.rounded.py-2.px-3.mb-2.relative.cursor-pointer.hover_bg-slate-50(
                v-if="showSelectLunch && isHoursLunchAvailable", @click="toggleDropdownLunch")
                p.leading-normal.text-primary-100 Seleziona Orario
                SVGIcon.text-primary-100(svg="arrow-down", :size="15")
                .absolute.inset-x-0.top-12.max-h-40.bg-white.rounded.shadow-lg.overflow-y-scroll.z-10(v-show="isDropdownOpenLunch")
                    p.py-2.px-3(v-for="time in workHoursAvailable.lunch", :key="time", @click="addTimeSetLunch(time)",
                        :class="{ 'cursor-not-allowed line-through	bg-gray-50 text-gray-200' : isTimeUsed(time), 'cursor-pointer text-grey-300 hover_bg-gray-100' : !isTimeUsed(time) }") {{ time }}

        //- Divider
        .h-full.border-r

        //- Dinner
        div

</template>
