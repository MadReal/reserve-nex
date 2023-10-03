<script setup lang="ts">
const i18n = useI18n();
import { storeToRefs } from "pinia";

definePageMeta({
  middleware: ["empty-restaurants-list", "auth"],
  layout: "admin-default",
});
useHead({ title: i18n.t("admin.reservations.page_name") });

const storeReservations = useReservationsStore();
const { reservationsList, reservationsAtDateList } = storeToRefs(storeReservations);

const isFilterAtDate = ref(false);

const setDateFilterReservation = (date: Date) => {
  if (date) {
    isFilterAtDate.value = true;
    storeReservations.fetchReservationsAtDate(date);
  } else isFilterAtDate.value = false;
};

const reservationsListToRender = computed(() => {
  if (isFilterAtDate.value) return reservationsAtDateList.value;
  else return reservationsList.value;
});

const noData = computed(() => !reservationsList.value.length);
</script>

<template>
  <div class="page__content">
    <AdminPageTitle :title="$t('admin.reservations.page_name')">
      <div class="mt-1 flex basis-full items-center md_ml-12 md_basis-40">
        <SVGIcon class="text-grey-200" svg="filter" />
        <AdminReservationFilterCalendar @setDateFilterReservation="setDateFilterReservation" />
      </div>
    </AdminPageTitle>
    <AdminNoData v-if="noData" text="Nessuna prenotazione in elenco." />

    <ul class="mb-8" v-else>
      <AdminReservationListItem v-for="item in reservationsListToRender" :key="item.id" :reservation="item" />
    </ul>
  </div>
</template>
