<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'empty-restaurants-list'], layout: 'admin-default' })

import { storeToRefs } from 'pinia'
import { useWorkTimesStore } from '~/stores/WorkTimes'

const storeWorkTimes = useWorkTimesStore();
const { lunchWorkTimesList, dinnerWorkTimesList } = storeToRefs(storeWorkTimes)

onMounted(async () => { await storeWorkTimes.fetchWorkTimes() });
</script>


<template lang="pug">
.admin-page
    AdminPageTitle(title="Gestione Orari")

    .grid.gap-8.lg_gap-6.mb-8.lg_border-b(class="grid-rows-[1fr_1px_1fr] lg_grid-rows-none lg_grid-cols-[1fr_1px_1fr]")
        div.lg_mb-6
            p.mb-4 Pranzo
            AdminSelectWorkTime(:workTimes="lunchWorkTimesList", :isLunch="true", @addNewTime="storeWorkTimes.addNewWorkTime", @removeTime="storeWorkTimes.removeWorkTime")

        .border-b.lg_border-r.lg_border-b-0

        div.lg_mb-6
            p.mb-4 Cena
            AdminSelectWorkTime(:workTimes="dinnerWorkTimesList", :isLunch="false", @addNewTime="storeWorkTimes.addNewWorkTime", @removeTime="storeWorkTimes.removeWorkTime")
</template>