<script setup lang="ts">
// @ts-ignore
const workTimes: WorkTime[] = await useFetchWorkHours() || []; // Provide an empty array as a default value
const lunchWorkTimesList = useSortWorkTimes(workTimes.filter((item: WorkTime) => item.mealType === "LUNCH"));
const dinnerWorkTimesList = useSortWorkTimes(workTimes.filter((item: WorkTime) => item.mealType === "DINNER"));

const todaysDate = useDateTimeFormatting(Date()).formattedDate
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
