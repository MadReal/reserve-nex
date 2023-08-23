<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWorkTimesStore } from '~/store/WorkTime'

const workTimesStore = useWorkTimesStore();
const { lunchWorkTimesList } = storeToRefs(workTimesStore)
const { dinnerWorkTimesList } = storeToRefs(workTimesStore)

const isLoading = ref(true)

onMounted(async () => {
    await workTimesStore.fetchWorkTimes()
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
            SelectWorkHour(:workTimes="lunchWorkTimesList", :isLunch="true", @addNewTime="workTimesStore.addNewWorkTime", @removeTime="workTimesStore.removeWorkTime")

        .h-full.border-r

        div.mb-6
            p.mb-4 Cena
            SelectWorkHour(:workTimes="dinnerWorkTimesList", :isLunch="false", @addNewTime="workTimesStore.addNewWorkTime", @removeTime="workTimesStore.removeWorkTime")
</template>
