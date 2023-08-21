<script setup lang="ts">
import restaurantWorkHours from "@/data/db-work-hours.json";
import workHoursAvailable from "@/data/work-hours-available.json";

// Define a constant for the imported data
const restaurantPranzoHours = ref(restaurantWorkHours.pranzo);
// pranzo
let showPranzoAddTime = ref(true)
let showPranzoSelect = ref(false)
let isPranzoDropdownOpen = ref(true)
const togglePranzoSelect = () => { showPranzoAddTime.value = false; showPranzoSelect.value = true }
const togglePranzoDropdown = () => isPranzoDropdownOpen.value = !isPranzoDropdownOpen.value;
const addTimeSetPranzo = (newTime: string) => {
    restaurantPranzoHours.value.push(newTime)
    restaurantPranzoHours.value.sort((a, b) => parseInt(a) - parseInt(b));
    showPranzoAddTime.value = true
    showPranzoSelect.value = false
    isPranzoDropdownOpen.value = false
}
const removeTimeSetPranzo = (index: number) => restaurantPranzoHours.value.splice(index, 1);
const isTimeUsed = (time: string) => restaurantWorkHours.pranzo.includes(time);

// cena
</script>


<template lang="pug">
.page
    PageTitle(title="Gestione Orari")

    .grid(class="grid-cols-[1fr_1px_1fr]").gap-6.border-b
        //- Pranzo
        div.mb-6
            p.mb-4 Pranzo
            //- TIME LIST
            .flex.items-center.justify-between.border.rounded.py-2.px-3.mb-2(v-for="(time, index) in restaurantPranzoHours", :key="time")
                p.leading-normal.text-grey-300 {{ time }}
                SVGIcon.text-grey-300.cursor-pointer.hover_text-error-200(svg="trash", :size="15", @click="removeTimeSetPranzo(index)")
            //- AGGIUNGI ORARIO
            .flex.items-center.justify-between.border.border-dashed.border-primary-100.rounded.py-2.px-3.mb-2.cursor-pointer.hover_bg-slate-50(
                v-if="showPranzoAddTime", @click="togglePranzoSelect")
                p.leading-normal.text-primary-100 Aggiungi Orario
                SVGIcon.text-primary-100(svg="plus", :size="15")
            //- SELECT TIME
            .flex.items-center.justify-between.border.border-primary-100.rounded.py-2.px-3.mb-2.relative.cursor-pointer.hover_bg-slate-50(
                v-if="showPranzoSelect", @click="togglePranzoDropdown")
                p.leading-normal.text-primary-100 Seleziona Orario
                SVGIcon.text-primary-100(svg="arrow-down", :size="15")
                .absolute.inset-x-0.top-12.max-h-40.bg-white.rounded.shadow-lg.overflow-y-scroll(v-show="isPranzoDropdownOpen")
                    p.text-grey-300.py-2.px-3.cursor-pointer(v-for="time in workHoursAvailable.pranzo", :key="time", 
                        :class="{ 'cursor-not-allowed line-through	bg-gray-50 text-gray-200' : isTimeUsed(time), 'hover_bg-gray-100' : !isTimeUsed(time) }", 
                        @click="addTimeSetPranzo(time)") {{ time }}

        //- Divider
        .h-full.border-r

        //- Cena
        div

</template>
