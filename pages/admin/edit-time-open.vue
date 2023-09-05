<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'empty-restaurants-list'], layout: 'admin-default' })
useHead({ title: 'Gestione Orari', })

import { storeToRefs } from 'pinia'
import { useWorkTimesStore } from '~/stores/WorkTimes'

const storeWorkTimes = useWorkTimesStore();
const { lunchWorkTimesList, dinnerWorkTimesList } = storeToRefs(storeWorkTimes)

storeWorkTimes.fetchWorkTimes()
</script>


<template lang="pug">
.admin-page
    AdminPageTitle(title="Gestione Orari")

    AdminContainerGrid
        div.lg_mb-6
            p.mb-4.mt-1 Pranzo
            AdminSelectWorkTime(:workTimes="lunchWorkTimesList", :isLunch="true", @addNewTime="storeWorkTimes.addNewWorkTime", @removeTime="storeWorkTimes.removeWorkTime")

        .border-b.lg_border-b-0.lg_border-r

        div.lg_mb-6
            p.mb-4.mt-1 Cena
            AdminSelectWorkTime(:workTimes="dinnerWorkTimesList", :isLunch="false", @addNewTime="storeWorkTimes.addNewWorkTime", @removeTime="storeWorkTimes.removeWorkTime")
</template>