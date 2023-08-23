<script setup lang="ts">
// @ts-ignore
const workTimes: WorkTime[] = await useFetchWorkHours() || []; // Provide an empty array as a default value
const lunchWorkHours = useSortWorkHours(workTimes.filter((item: WorkTime) => item.mealType === "LUNCH"));
const dinnerWorkHours = useSortWorkHours(workTimes.filter((item: WorkTime) => item.mealType === "DINNER"));

const addNewTime = async (newTime: WorkTime['time'], isLunch: boolean) => {
    try {
        const response = await $fetch('/api/work-hours', {
            method: 'post',
            body: { mealType: isLunch ? 'LUNCH' : 'DINNER', time: newTime }
        })
        // workTimes.push(response)
    } catch (error) { console.error(error); }
}
const removeTime = async (timeId: WorkTime['id'], isLunch: boolean) => {
    try {
        await $fetch(`/api/work-hours/${timeId}`, { method: 'delete', })
        // const workTimeIndex = workTimes.findIndex(e => e.id === timeId)
        // workTimes.splice(workTimeIndex, 1)
    } catch (error) { console.error(error); }
}
</script>


<template lang="pug">
.page
    PageTitle(title="Gestione Orari")

    .grid.gap-6.border-b(class="grid-cols-[1fr_1px_1fr]")
        div.mb-6
            p.mb-4 Pranzo
            SelectWorkHour(:workTimes="lunchWorkHours", :isLunch="true", @addNewTime="addNewTime", @removeTime="removeTime")

        .h-full.border-r

        div.mb-6
            p.mb-4 Cena
            SelectWorkHour(:workTimes="dinnerWorkHours", :isLunch="false", @addNewTime="addNewTime", @removeTime="removeTime")
</template>
