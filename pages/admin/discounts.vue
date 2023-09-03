<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'empty-restaurants-list'], layout: 'admin-default' })

import { storeToRefs } from 'pinia'
import { useWorkTimesStore } from '~/stores/WorkTimes'

const storeWorkTimes = useWorkTimesStore();
storeWorkTimes.fetchWorkTimes()
const { lunchWorkTimesList, dinnerWorkTimesList } = storeToRefs(storeWorkTimes)

const selectedDayOfWeek = ref(1)
</script>


<template lang="pug">
.admin-page
    AdminPageTitle(title="Gestione Orari")

    //- AdminNoData(v-if="noData", text="Aggiungi orari di apertura prima di poter vedere le prenotazioni.", buttonText="Aggiungi Orari", linkPath="edit-time-open")
    .flex.items-center.mb-8.gap-2
        .py-1.px-2.text-black.text-sm.border.rounded-md.hover_border-grey-200.cursor-pointer(v-for="dayInt in 7", :key="dayInt", 
            :class="{ 'border border-primary-100 text-primary-100 bg-primary-100/10' : selectedDayOfWeek === dayInt }"
            @click="selectedDayOfWeek = dayInt") {{ useTranslateDayOfWeek(dayInt) }}


    .grid.mb-8(class="grid-rows-[1fr_1px] lg_grid-rows-none lg_grid-cols-[3fr_1px_1fr]")
        .grid.gap-8.lg_gap-6.mb-8.lg_border-b(class="grid-rows-[1fr_1px_1fr] lg_grid-rows-none lg_grid-cols-[1fr_1px_1fr]")
            div.lg_mb-6
                p.mb-4 Pranzo
                .grid.grid-cols-3.lg_grid-cols-4.gap-2
                    //- AdminBoxReservation(v-for="workTime in storeWorkTimes.lunchWorkTimesList", :key="workTime.id" :workTime="workTime")

            .border-b.lg_border-r.lg_border-b-0

            div.lg_mb-6
                p.mb-4 Cena
                .grid.grid-cols-3.lg_grid-cols-4.gap-2
                    //- AdminBoxReservation(v-for="workTime in storeWorkTimes.dinnerWorkTimesList", :key="workTime.id" :workTime="workTime")

        .border-b.lg_border-r.lg_border-b-0

        div.lg_mb-6.px-6
            p.mb-4 Sconti
          
                
</template>