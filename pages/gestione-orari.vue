<script setup lang="ts">
// @ts-ignore
const workHours: WorkHour[] = await useFetchWorkHours() || []; // Provide an empty array as a default value
const lunchWorkHours = workHours.filter((item: WorkHour) => item.mealType === "LUNCH");
const dinnerWorkHours = workHours.filter((item: WorkHour) => item.mealType === "DINNER");

const addNewTimeSlot = async (newTimeSlot: WorkHour['timeSlot'], isLunch: boolean) => {
    try {
        const response = await $fetch('/api/work-hours', {
            method: 'post',
            body: { mealType: isLunch ? 'LUNCH' : 'DINNER', timeSlot: newTimeSlot }
        })
        // workHours.push(response)
    } catch (error) { console.error(error); }
}
const removeTimeSlot = async (timeSlotId: WorkHour['id'], isLunch: boolean) => {
    try {
        await $fetch(`/api/work-hours/${timeSlotId}`, { method: 'delete', })
        // const workHourIndex = workHours.findIndex(e => e.id === timeSlotId)
        // workHours.splice(workHourIndex, 1)
    } catch (error) { console.error(error); }
}
</script>


<template lang="pug">
.page
    PageTitle(title="Gestione Orari")

    .grid.gap-6.border-b(class="grid-cols-[1fr_1px_1fr]")

        div.mb-6
            p.mb-4 Pranzo
            SelectWorkHour(:workHours="lunchWorkHours", :isLunch="true", @addNewTimeSlot="addNewTimeSlot", @removeTimeSlot="removeTimeSlot")
        //- Divider
        .h-full.border-r

        div.mb-6
            p.mb-4 Cena
            SelectWorkHour(:workHours="dinnerWorkHours", :isLunch="false", @addNewTimeSlot="addNewTimeSlot", @removeTimeSlot="removeTimeSlot")


</template>
