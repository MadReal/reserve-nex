<script setup lang="ts">
import { useWorkTimesStore } from '~/stores/WorkTimes'

const workTimeStore = useWorkTimesStore();
const todaysDate = useDateTimeFormatting(Date()).formattedDate
</script>


<template lang="pug">
.page
    PageTitle(title="Riepilogo Giorno", :date="todaysDate")

    .grid.gap-6.border-b.mb-8(class="grid-cols-[1fr_1px_1fr]")
        div.mb-6
            p.mb-4 Lunch
            .grid.grid-cols-4.gap-2
                BoxReservation(v-for="workTime in workTimeStore.lunchWorkTimesList", :key="workTime.id" :workTime="workTime", :todaysDate="todaysDate")

        .h-full.border-r

        div.mb-6
            p.mb-4 Dinner
            .grid.grid-cols-4.gap-2
                BoxReservation(v-for="workTime in workTimeStore.dinnerWorkTimesList", :key="workTime.id" :workTime="workTime", :todaysDate="todaysDate")
</template>
~/stores/WorkTimes~/stores/WorkTimes