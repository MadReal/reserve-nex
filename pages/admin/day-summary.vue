<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "empty-restaurants-list"],
  layout: "admin-default",
});
useHead({ title: "Riepilogo Giorno" });

import { lunch, dinner } from "~/data/work-times-available.json";
import { storeToRefs } from "pinia";
import { useWorkTimesStore } from "~/stores/WorkTimes";
import { useReservationsStore } from "@/stores/Reservations";
const storeReservations = useReservationsStore();
const { reservationsList } = storeToRefs(storeReservations);

const storeWorkTimes = useWorkTimesStore();
const todaysDate = useDateFormatting(Date());
const selectedTime = ref(null);

function computedReservationsTotalPeople(timeArray: string[]) {
  return computed(() =>
    reservationsList.value
      .filter((item) => timeArray.includes(item.time) && item.accepted && useDateFormatting(item.date) === todaysDate)
      .reduce((totalPeopleAmount, item) => totalPeopleAmount + item.peopleAmount, 0),
  );
}

// Use the function to create the computed properties
const lunchReservationsPeopleAmount = computedReservationsTotalPeople(lunch);
const dinnerReservationsPeopleAmount = computedReservationsTotalPeople(dinner);
const reservationsListAtSelectedTime = computed(() =>
  reservationsList.value.filter(
    (item) => item.accepted && item.time === selectedTime.value && useDateFormatting(item.date) === todaysDate,
  ),
);

const noData = computed(() => !storeWorkTimes.lunchWorkTimesList.length && !storeWorkTimes.dinnerWorkTimesList.length);
</script>

<template lang="pug">
.page__content
    AdminPageTitle(title="Riepilogo Giorno", :date="todaysDate")

    AdminNoData(v-if="noData", text="Aggiungi orari di apertura prima di poter vedere le prenotazioni.", buttonText="Aggiungi Orari", linkPath="edit-time-open")
    AdminContainerGrid2ColsBorder(v-else)
        .lg_mb-6
            p.mb-4.mt-1 Pranzo #[span.text-sm.text-grey-200 (totale: {{ lunchReservationsPeopleAmount }})]
            AdminContainerGrid4Cols
                AdminBoxReservation(v-for="workTime in storeWorkTimes.lunchWorkTimesList", :key="workTime.id"                    
                    :workTime="workTime", :todaysDate="todaysDate", @click="selectedTime = workTime.time", :isSelected="selectedTime === workTime.time")

        AdminContainerDivider

        .lg_mb-6
            p.mb-4.mt-1 Cena #[span.text-sm.text-grey-200 (totale: {{ dinnerReservationsPeopleAmount }})]
            AdminContainerGrid4Cols
                AdminBoxReservation(v-for="workTime in storeWorkTimes.dinnerWorkTimesList", :key="workTime.id"                    
                    :workTime="workTime", :todaysDate="todaysDate", @click="selectedTime = workTime.time", :isSelected="selectedTime === workTime.time")

    .mt-8(v-if="lunchReservationsPeopleAmount > 0 || dinnerReservationsPeopleAmount > 0")
        h3.text-lg.text-grey-300 Prenotazioni
        p.text-sm.text-grey-100.font-light Qui sotto puoi vedere le prenotazioni effettuate nell'orario selezionato.

        ul.mt-8
            AdminReservationListItem(v-for="item in reservationsListAtSelectedTime", :key="item.id", :reservation="item")
</template>
