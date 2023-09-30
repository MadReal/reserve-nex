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
const selectedTime = ref();

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

<template>
  <div class="page__content">
    <AdminPageTitle :title="$t('admin.day_summary.page_name')" :date="todaysDate" />
    <AdminNoData
      v-if="noData"
      text="Aggiungi orari di apertura prima di poter vedere le prenotazioni."
      buttonText="Aggiungi Orari"
      linkPath="work-hours"
    />
    <AdminContainerGrid2ColsBorder v-else>
      <div class="md_mb-6">
        <p class="mb-4 mt-1">
          {{ $t("admin.lunch") }}
          <span class="text-sm text-grey-200">({{ $t("admin.total") }}: {{ lunchReservationsPeopleAmount }})</span>
        </p>
        <AdminContainerGrid4Cols>
          <AdminBoxReservation
            v-for="workTime in storeWorkTimes.lunchWorkTimesList"
            :key="workTime.id"
            :workTime="workTime"
            :todaysDate="todaysDate"
            @click="selectedTime = workTime.time"
            :isSelected="selectedTime === workTime.time"
          />
        </AdminContainerGrid4Cols>
      </div>
      <AdminContainerDivider />
      <div class="md_mb-6">
        <p class="mb-4 mt-1">
          {{ $t("admin.dinner") }}
          <span class="text-sm text-grey-200">({{ $t("admin.total") }}: {{ dinnerReservationsPeopleAmount }})</span>
        </p>
        <AdminContainerGrid4Cols>
          <AdminBoxReservation
            v-for="workTime in storeWorkTimes.dinnerWorkTimesList"
            :key="workTime.id"
            :workTime="workTime"
            :todaysDate="todaysDate"
            @click="selectedTime = workTime.time"
            :isSelected="selectedTime === workTime.time"
          />
        </AdminContainerGrid4Cols>
      </div>
    </AdminContainerGrid2ColsBorder>
    <div class="mt-8" v-if="lunchReservationsPeopleAmount &gt; 0 || dinnerReservationsPeopleAmount &gt; 0">
      <h3 class="text-lg text-grey-300">Prenotazioni</h3>
      <p class="text-sm font-light text-grey-100">Qui sotto puoi vedere le prenotazioni effettuate nell'orario selezionato.</p>
      <ul class="mt-8">
        <AdminReservationListItem v-for="item in reservationsListAtSelectedTime" :key="item.id" :reservation="item" />
      </ul>
    </div>
  </div>
</template>
