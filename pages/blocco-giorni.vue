<script setup lang="ts">
import weekDaysAvailable from "@/data/week-days-available.json";
import restaurantWeekDaysBlocked from "@/data/db-week-days-blocked.json";

const isDropdownDownOpen = ref({
    ref: 1,
    isOpen: false,
})
const toggleDropdown = () => isDropdownDownOpen.value.isOpen = !isDropdownDownOpen.value.isOpen;

</script>


<template lang="pug">
.page
    PageTitle(title="Blocco Giorni")

    .grid(class="grid-cols-[2fr_1px_1fr]").gap-6.border-b.items-center

        div.mb-8.mt-2
            p.text-lg.text-grey-300 Giorno di Chiusura Settimanale
            p.text-sm.text-grey-200.font-light Personalizza il giorno di chiusura settimanale del ristorante. Questa opzione ti consente di stabilire con precisione il giorno in cui il ristorante resterà chiuso ogni settimana.

        //- Divider
        .h-full.border-r

        //- WEEK's DAY
        div
            //- SELECT
            .flex.items-center.justify-between.border.rounded.py-2.px-3.mb-2.relative.cursor-pointer.hover_bg-slate-50(@click="toggleDropdown")
                p.leading-normal.text-grey-200.text-sm Seleziona giorno
                SVGIcon.text-primary-100(svg="arrow-down", :size="15")
                //- Dropdown
                .absolute.inset-x-0.top-12.max-h-40.bg-white.rounded.shadow-lg.overflow-y-scroll(v-show="isDropdownDownOpen.isOpen")
                    p.text-grey-300.py-2.px-3.cursor-pointer(v-for="day in weekDaysAvailable", :key="day", 
                        :class="{ 'cursor-not-allowed line-through	bg-gray-50 text-gray-200' : true, 'hover_bg-gray-100' : !true }", 
                        @click="addTimeSetPranzo(time)") {{ day }}
</template>
