<script setup lang="ts">
import { useWorkTimesStore } from '~/store/WorkTime'
import { storeToRefs } from 'pinia'

const workTimeStore = useWorkTimesStore();
const { lunchWorkTimesList } = storeToRefs(workTimeStore)
const { dinnerWorkTimesList } = storeToRefs(workTimeStore)

const todaysDate = useDateTimeFormatting(Date()).formattedDate

onMounted(async () => {
    await workTimeStore.fetchWorkTimes()
});
</script>


<template lang="pug">
.page
    PageTitle(title="Riepilogo Giorno", :date="todaysDate")

    .grid.gap-6.border-b.mb-8(class="grid-cols-[1fr_1px_1fr]")
        div.mb-6
            p.mb-4 Lunch
            .grid.grid-cols-4.gap-2
                BoxReservation(v-for="workTime in lunchWorkTimesList", :key="workTime.id" :workTime="workTime", :todaysDate="todaysDate")

        .h-full.border-r

        div.mb-6
            p.mb-4 Dinner
            .grid.grid-cols-4.gap-2
                BoxReservation(v-for="workTime in dinnerWorkTimesList", :key="workTime.id" :workTime="workTime", :todaysDate="todaysDate")
</template>
