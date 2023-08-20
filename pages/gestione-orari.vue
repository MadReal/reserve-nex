<script setup lang="ts">
import workHoursRestaurant from "@/data/work-hours-restaurant.json";
import workHoursAvailable from "@/data/work-hours-available.json";

// pranzo
let showPranzoAddTime = ref(true)
let showPranzoSelect = ref(false)
let isOpenPranzoDropdown = ref(true)
const togglePranzoSelect = () => { showPranzoAddTime.value = false; showPranzoSelect.value = true }
const togglePranzoDropdown = () => isOpenPranzoDropdown.value = !isOpenPranzoDropdown.value;
// cena
let isOpenCenaDropdown = ref(false)
</script>


<template lang="pug">
.page
    PageTitle(title="Gestione Orari")

    .grid(class="grid-cols-[1fr_1px_1fr]").gap-6.border-b
        //- Pranzo
        div.mb-6
            p.mb-4 Pranzo
            .flex.items-center.justify-between.border.rounded.py-2.px-3.mb-2(v-for="time in workHoursRestaurant.pranzo", :key="time")
                p.leading-normal.text-grey-300 {{ time }}
                SVGIcon.text-grey-300(svg="trash", :size="15")
            a.flex.items-center.justify-between.border.border-dashed.border-primary-100.rounded.py-2.px-3.mb-2(v-if="showPranzoAddTime", @click="togglePranzoSelect")
                p.leading-normal.text-primary-100 Aggiungi Orario
                SVGIcon.text-primary-100(svg="plus", :size="15")
            a.flex.items-center.justify-between.border.border-primary-200.rounded.py-2.px-3.mb-2.relative(v-if="showPranzoSelect", @click="togglePranzoDropdown")
                p.leading-normal.text-primary-200 Seleziona Orario
                SVGIcon.text-primary-200(svg="arrow-down", :size="15")
                .absolute.inset-x-0.top-12.max-h-40.bg-white.rounded.shadow-lg.overflow-y-scroll(v-show="isOpenPranzoDropdown")
                    p.text-grey-300.py-2.px-3.hover_bg-gray-100(v-for="time in workHoursAvailable.pranzo", :key="time") {{ time }}

        //- Divider
        .h-full.border-r

        //- Cena
        div

</template>
