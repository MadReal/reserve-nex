<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWorkTimesStore } from '~/store/WorkTime'

const workTimesStore = useWorkTimesStore();
const { lunchWorkTimesList } = storeToRefs(workTimesStore)
const { dinnerWorkTimesList } = storeToRefs(workTimesStore)

onMounted(async () => { await workTimesStore.fetchWorkTimes() });
</script>


<template lang="pug">
.page
    PageTitle(title="Gestione Orari")

    .grid.gap-6.border-b(class="grid-cols-[1fr_1px_1fr]")
        div.mb-6
            p.mb-4 Pranzo
            SelectWorkTime(:workTimes="lunchWorkTimesList", :isLunch="true", @addNewTime="workTimesStore.addNewWorkTime", @removeTime="workTimesStore.removeWorkTime")

        .h-full.border-r

        div.mb-6
            p.mb-4 Cena
            SelectWorkTime(:workTimes="dinnerWorkTimesList", :isLunch="false", @addNewTime="workTimesStore.addNewWorkTime", @removeTime="workTimesStore.removeWorkTime")
</template>
