<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'empty-restaurants-list'], layout: 'admin-default' })

import { useWorkTimesStore } from '~/stores/WorkTimes'

const storeWorkTimes = useWorkTimesStore();
const todaysDate = useDateFormatting(Date())

const noData = computed(() => (!storeWorkTimes.lunchWorkTimesList.length && !storeWorkTimes.dinnerWorkTimesList.length))
// storeWorkTimes.fetchWorkTimes()
</script>


<template lang="pug">
.admin-page
    AdminPageTitle(title="Riepilogo Giorno", :date="todaysDate")

    AdminNoData(v-if="noData", text="Aggiungi orari di apertura prima di poter vedere le prenotazioni.", buttonText="Aggiungi Orari", linkPath="edit-time-open")

    .grid.gap-8.lg_gap-6.mb-8.lg_border-b(class="grid-rows-[1fr_1px_1fr] lg_grid-rows-none lg_grid-cols-[1fr_1px_1fr]", v-else)
        div.lg_mb-8
            p.mb-4 Pranzo
            .grid.grid-cols-3.lg_grid-cols-4.gap-2
                AdminBoxReservation(v-for="workTime in storeWorkTimes.lunchWorkTimesList", :key="workTime.id" :workTime="workTime", :todaysDate="todaysDate")

        .border-b.lg_border-r.lg_border-b-0

        div.lg_mb-8
            p.mb-4 Cena
            .grid.grid-cols-3.lg_grid-cols-4.gap-2
                AdminBoxReservation(v-for="workTime in storeWorkTimes.dinnerWorkTimesList", :key="workTime.id" :workTime="workTime", :todaysDate="todaysDate")
</template>