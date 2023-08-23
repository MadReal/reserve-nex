<script setup lang="ts">
import { useWorkTimesStore } from '~/store/WorkTime'
import { storeToRefs } from 'pinia'

const workTimeStore = useWorkTimesStore();
const { lunchWorkTimesList } = storeToRefs(workTimeStore)
const { dinnerWorkTimesList } = storeToRefs(workTimeStore)

const isLoading = ref(true)

onMounted(async () => {
    await workTimeStore.fetchWorkHours()
    isLoading.value = false
});
</script>


<template lang="pug">
.page
    PageTitle(title="Gestione Orari")

    p.text-blue-500(v-if="isLoading") Loading...

    .grid.gap-6.border-b(class="grid-cols-[1fr_1px_1fr]", v-else)
        div.mb-6
            p.mb-4 Pranzo
            SelectWorkHour(:workTimes="lunchWorkTimesList", :isLunch="true", @addNewTime="workTimeStore.addNewWorkTime", @removeTime="workTimeStore.removeWorkTime")

        .h-full.border-r

        div.mb-6
            p.mb-4 Cena
            SelectWorkHour(:workTimes="dinnerWorkTimesList", :isLunch="false", @addNewTime="workTimeStore.addNewWorkTime", @removeTime="workTimeStore.removeWorkTime")
</template>
