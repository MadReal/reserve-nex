<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWorkTimesStore } from '~/store/WorkTimes'

const storeWorkTimes = useWorkTimesStore();
const { lunchWorkTimesList } = storeToRefs(storeWorkTimes)
const { dinnerWorkTimesList } = storeToRefs(storeWorkTimes)

onBeforeMount(async () => { await storeWorkTimes.fetchWorkTimes() });
</script>


<template lang="pug">
.page
    PageTitle(title="Gestione Orari")

    .grid.gap-6.border-b(class="grid-cols-[1fr_1px_1fr]")
        div.mb-6
            p.mb-4 Pranzo
            SelectWorkTime(:workTimes="lunchWorkTimesList", :isLunch="true", @addNewTime="storeWorkTimes.addNewWorkTime", @removeTime="storeWorkTimes.removeWorkTime")

        .h-full.border-r

        div.mb-6
            p.mb-4 Cena
            SelectWorkTime(:workTimes="dinnerWorkTimesList", :isLunch="false", @addNewTime="storeWorkTimes.addNewWorkTime", @removeTime="storeWorkTimes.removeWorkTime")
</template>
