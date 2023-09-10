<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'empty-restaurants-list'], layout: 'admin-default' })
useHead({ title: 'Riepilogo Giorno', })

import { lunch, dinner } from "~/data/work-times-available.json";
import { storeToRefs } from 'pinia'
import { useWorkTimesStore } from '~/stores/WorkTimes'
import { useReservationsStore } from '@/stores/Reservations';
const storeReservations = useReservationsStore();
const { reservationsList } = storeToRefs(storeReservations)

const storeWorkTimes = useWorkTimesStore();
const todaysDate = useDateFormatting(Date())

function computedReservationsTotalPeople(timeArray: string[]) {
    return computed(() =>
        reservationsList.value
            .filter((item) => timeArray.includes(item.time) && item.accepted && useDateFormatting(item.date) === todaysDate)
            .reduce((totalPeopleAmount, item) => totalPeopleAmount + item.peopleAmount, 0)
    );
}

// Use the function to create the computed properties
const lunchReservationsPeopleAmount = computedReservationsTotalPeople(lunch);
const dinnerReservationsPeopleAmount = computedReservationsTotalPeople(dinner);

const noData = computed(() => (!storeWorkTimes.lunchWorkTimesList.length && !storeWorkTimes.dinnerWorkTimesList.length))
</script>


<template lang="pug">
.page__content
    AdminPageTitle(title="Riepilogo Giorno", :date="todaysDate")

    AdminNoData(v-if="noData", text="Aggiungi orari di apertura prima di poter vedere le prenotazioni.", buttonText="Aggiungi Orari", linkPath="edit-time-open")
    AdminContainerGrid2ColsBorder(v-else)
        .lg_mb-6
            p.mb-4.mt-1 Pranzo #[span.text-sm.text-grey-200 (totale: {{ lunchReservationsPeopleAmount }})]
            AdminContainerGrid4Cols
                AdminReservationBox(v-for="workTime in storeWorkTimes.lunchWorkTimesList", :key="workTime.id" :workTime="workTime", :todaysDate="todaysDate")

        AdminContainerDivider

        .lg_mb-6
            p.mb-4.mt-1 Cena #[span.text-sm.text-grey-200 (totale: {{ dinnerReservationsPeopleAmount }})]
            AdminContainerGrid4Cols
                AdminReservationBox(v-for="workTime in storeWorkTimes.dinnerWorkTimesList", :key="workTime.id" :workTime="workTime", :todaysDate="todaysDate")
</template>