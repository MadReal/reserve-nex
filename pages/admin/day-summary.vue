<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'empty-restaurants-list'], layout: 'admin-default' })
useHead({ title: 'Riepilogo Giorno', })

import { storeToRefs } from 'pinia'
import { useWorkTimesStore } from '~/stores/WorkTimes'
import { useReservationsStore } from '@/stores/Reservations';
const storeReservations = useReservationsStore();
const { lunchReservationsList, dinnerReservationsList } = storeToRefs(storeReservations)

const storeWorkTimes = useWorkTimesStore();
const todaysDate = useDateFormatting(Date())

const noData = computed(() => (!storeWorkTimes.lunchWorkTimesList.length && !storeWorkTimes.dinnerWorkTimesList.length))
</script>


<template lang="pug">
.admin-page
    AdminPageTitle(title="Riepilogo Giorno", :date="todaysDate")

    AdminNoData(v-if="noData", text="Aggiungi orari di apertura prima di poter vedere le prenotazioni.", buttonText="Aggiungi Orari", linkPath="edit-time-open")

    .grid.gap-8.lg_gap-6.lg_border-b(class="grid-rows-[1fr_1px_1fr] lg_grid-rows-none lg_grid-cols-[1fr_1px_1fr]", v-else)
        div.lg_mb-6
            p.mb-4.mt-1 Pranzo #[span.text-sm.text-grey-300 (totale: {{ lunchReservationsList.length }})]
            .grid.grid-cols-3.lg_grid-cols-4.gap-2
                AdminBoxReservation(v-for="workTime in storeWorkTimes.lunchWorkTimesList", :key="workTime.id" :workTime="workTime", :todaysDate="todaysDate")

        .border-b.lg_border-r.lg_border-b-0

        div.lg_mb-6
            p.mb-4.mt-1 Cena #[span.text-sm.text-grey-300 (totale: {{ dinnerReservationsList.length }})]
            .grid.grid-cols-3.lg_grid-cols-4.gap-2
                AdminBoxReservation(v-for="workTime in storeWorkTimes.dinnerWorkTimesList", :key="workTime.id" :workTime="workTime", :todaysDate="todaysDate")
</template>