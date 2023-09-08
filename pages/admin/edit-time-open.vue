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
.page__content
    AdminPageTitle(title="Gestione Orari")

    AdminContainerGrid2ColsBorder
        .lg_mb-6
            p.mb-4.mt-1 Pranzo
            AdminSelectWorkTime(:workTimes="lunchWorkTimesList", :isLunch="true", @addNewTime="storeWorkTimes.addNewWorkTime", @removeTime="storeWorkTimes.removeWorkTime")

        AdminContainerDivider

        .lg_mb-6
            p.mb-4.mt-1 Cena
            AdminSelectWorkTime(:workTimes="dinnerWorkTimesList", :isLunch="false", @addNewTime="storeWorkTimes.addNewWorkTime", @removeTime="storeWorkTimes.removeWorkTime")
</template>