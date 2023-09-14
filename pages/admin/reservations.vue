<script setup lang="ts">
definePageMeta({
  middleware: ["empty-restaurants-list", "auth"],
  layout: "admin-default",
});
useHead({ title: "Prenotazioni" });

import { storeToRefs } from "pinia";
import { useReservationsStore } from "@/stores/Reservations";

const storeReservations = useReservationsStore();
const { reservationsList } = storeToRefs(storeReservations);
const { openModal } = useOpenModal();

const noData = computed(() => !reservationsList.value.length);
</script>

<template lang="pug">
.page__content
    AdminPageTitle(title="Prenotazioni")
    AdminNoData(v-if="noData", text="Nessuna prenotazione in elenco.")

    ul.mb-8(v-else)
        AdminReservationListItem(v-for="item in reservationsList", :key="item.id", :reservation="item")
</template>
