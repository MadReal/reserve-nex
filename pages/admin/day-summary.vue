<script setup lang="ts">
definePageMeta({
    middleware: ['auth', 'empty-restaurants-list']
})
import { useWorkTimesStore } from '~/stores/WorkTimes'

const workTimeStore = useWorkTimesStore();
const todaysDate = useDateTimeFormatting(Date()).formattedDate

const noData = computed(() => (!workTimeStore.lunchWorkTimesList.length && !workTimeStore.dinnerWorkTimesList.length))
// workTimeStore.fetchWorkTimes()
</script>


<template lang="pug">
.page
    PageTitle(title="Riepilogo Giorno", :date="todaysDate")

    NoData(v-if="noData", text="Aggiungi orari di apertura prima di poter vedere le prenotazioni.", buttonText="Aggiungi Orari", linkPath="edit-time-open")

    .grid.gap-6.border-b.mb-8(class="grid-cols-[1fr_1px_1fr]", v-else)
        div.mb-6
            p.mb-4 Pranzo
            .grid.grid-cols-4.gap-2
                BoxReservation(v-for="workTime in workTimeStore.lunchWorkTimesList", :key="workTime.id" :workTime="workTime", :todaysDate="todaysDate")

        .h-full.border-r

        div.mb-6
            p.mb-4 Cena
            .grid.grid-cols-4.gap-2
                BoxReservation(v-for="workTime in workTimeStore.dinnerWorkTimesList", :key="workTime.id" :workTime="workTime", :todaysDate="todaysDate")
</template>