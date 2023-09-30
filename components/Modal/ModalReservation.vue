<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useModalsStore } from "~/stores/Modals";
import { useReservationsStore } from "~/stores/Reservations";

const storeModals = useModalsStore();
const storeReservations = useReservationsStore();
const { activeModalOption } = storeToRefs(storeModals);
const { reservationsList } = storeToRefs(storeReservations);

const selectedReservation = ref(reservationsList.value.filter((item: Reservation) => item.id === activeModalOption.value)[0]);
const instagramName = ref(
  selectedReservation.value.personInstagram
    ? selectedReservation.value.personInstagram.includes("@")
      ? selectedReservation.value.personInstagram
      : `@${selectedReservation.value.personInstagram}`
    : "-",
);

const updateReservation = async (reservationId: Reservation["id"], isAccepted: boolean) => {
  if (confirm("Sicuro di voler rifiutare la prenotazione? \nSe procedi, il cliente verrà informato della cancellazione.")) {
    await storeReservations.updateReservation(reservationId, isAccepted);
    storeModals.closeModal();
  }
};
</script>

<template>
  <div class="flex h-full items-center justify-center capitalize">
    <div class="basis-full text-center">
      <p class="mb-4 text-lg font-semibold">{{ $t("modal.reservation.title") }}</p>
      <table
        class="hidden w-full table-fixed border-collapse border border-slate-400 bg-white text-left text-sm shadow-sm md_table"
      >
        <tbody>
          <tr>
            <td class="w-28 border p-3 text-grey-300">ID</td>
            <td class="border p-3 text-grey-200">{{ `#${selectedReservation.id}` }}</td>
          </tr>
          <tr>
            <td class="w-28 border p-3 text-grey-300">{{ $t("modal.reservation.date") }}</td>
            <td class="border p-3 text-grey-200">
              {{ useDateFormatting(selectedReservation.date) }}
              <span class="ml-2 font-medium text-grey-300"
                >{{ $t("modal.reservation.time") }}
                <span class="font-semibold text-grey-300">{{ selectedReservation.time }}</span></span
              >
            </td>
          </tr>
          <tr>
            <td class="w-28 border p-3 text-grey-300">{{ $t("modal.reservation.people_amount") }}</td>
            <td class="border p-3 text-grey-200">{{ selectedReservation.peopleAmount }}</td>
          </tr>
          <tr>
            <td class="w-28 border p-3 text-red-500">{{ $t("modal.reservation.discount") }}</td>
            <td class="border p-3 text-red-500">
              {{ selectedReservation.discountAmount }}{{ selectedReservation.discountAmount ? "%" : "" }}
            </td>
          </tr>
          <tr>
            <td class="w-28 border p-3 text-grey-300">{{ $t("modal.reservation.name") }}</td>
            <td class="border p-3 text-grey-200">{{ selectedReservation.personName }}</td>
          </tr>
          <tr>
            <td class="w-28 border p-3 text-grey-300">{{ $t("modal.reservation.phone") }}</td>
            <td class="border p-3 text-grey-200">{{ selectedReservation.personPhone }}</td>
          </tr>
          <tr>
            <td class="w-28 border p-3 text-grey-300">Email</td>
            <td class="border p-3 lowercase text-grey-200">{{ selectedReservation.personEmail }}</td>
          </tr>
          <tr>
            <td class="w-28 border p-3 text-grey-300">Instagram</td>
            <td class="border p-3 text-grey-200">{{ instagramName }}</td>
          </tr>
          <tr class="bg-slate-100" v-if="selectedReservation.accepted === true">
            <td class="w-28 border p-3 text-grey-300">{{ $t("modal.reservation.status") }}</td>
            <td class="border p-3 font-semibold text-success-200">{{ $t("modal.reservation.status_accepted") }}</td>
          </tr>
          <tr class="bg-slate-100" v-else-if="selectedReservation.accepted === false">
            <td class="w-28 border p-3 text-grey-300">{{ $t("modal.reservation.status") }}</td>
            <td class="border p-3 font-semibold text-error-200">{{ $t("modal.reservation.status_cancelled") }}</td>
          </tr>
        </tbody>
      </table>

      <div class="w-full bg-white text-left text-sm md_hidden">
        <ul>
          <li class="mb-2">
            <p class="text-grey-300">ID:</p>
            <p class="text-xs text-grey-200">{{ `#${selectedReservation.id}` }}</p>
          </li>
          <li class="mb-2">
            <p class="text-grey-300">{{ $t("modal.reservation.date") }}:</p>
            <p class="text-sm text-grey-200">
              {{ useDateFormatting(selectedReservation.date) }}
              <span class="ml-2 font-medium text-grey-300">
                {{ $t("modal.reservation.time") }} <span class="font-semibold text-grey-300">{{ selectedReservation.time }}</span>
              </span>
            </p>
          </li>
          <li class="mb-2">
            <p class="text-grey-300">
              <span class="font-medium">{{ $t("modal.reservation.people_amount") }}:</span> {{ selectedReservation.peopleAmount }}
            </p>
          </li>
          <li class="mb-2">
            <p class="text-red-500">
              <span class="font-medium">{{ $t("modal.reservation.discount") }}:</span> {{ selectedReservation.discountAmount
              }}{{ selectedReservation.discountAmount ? "%" : "" }}
            </p>
          </li>
          <li class="mb-2">
            <p class="text-grey-300">{{ $t("modal.reservation.name") }}:</p>
            <p class="text-sm text-grey-200">{{ selectedReservation.personName }}</p>
          </li>
          <li class="mb-2">
            <p class="text-grey-300">{{ $t("modal.reservation.phone") }}:</p>
            <p class="text-sm text-grey-200">{{ selectedReservation.personPhone }}</p>
          </li>
          <li class="mb-2">
            <p class="text-grey-300">Email:</p>
            <p class="text-sm lowercase text-grey-200">{{ selectedReservation.personEmail }}</p>
          </li>
          <li class="mb-2">
            <p class="text-grey-300">Instagram:</p>
            <p class="text-sm text-grey-200">{{ instagramName }}</p>
          </li>
          <li class="mb-2" v-if="selectedReservation.accepted === true">
            <p class="text-grey-300">{{ $t("modal.reservation.status") }}:</p>
            <p class="text-sm font-semibold text-success-200">{{ $t("modal.reservation.status_accepted") }}</p>
          </li>
          <li class="mb-2" v-else-if="selectedReservation.accepted === false">
            <p class="text-grey-300">{{ $t("modal.reservation.status") }}:</p>
            <p class="text-sm font-semibold text-error-200">{{ $t("modal.reservation.status_cancelled") }}</p>
          </li>
        </ul>
      </div>
      <div class="mt-5 flex items-center justify-center gap-2 text-sm uppercase md_text-base">
        <button
          class="cursor-pointer rounded bg-success-200 px-4 py-2 text-sm font-medium uppercase text-white hover_bg-success-200/80"
          v-if="selectedReservation.accepted === null"
          @click="updateReservation(selectedReservation.id, true)"
        >
          {{ $t("modal.reservation.btn_accept") }}
        </button>
        <button
          class="cursor-pointer rounded bg-error-200 px-4 py-2 text-sm font-medium uppercase text-white hover_bg-error-200/80"
          v-if="selectedReservation.accepted !== false"
          @click="updateReservation(selectedReservation.id, false)"
        >
          {{ $t("modal.reservation.btn_cancel") }}
        </button>
      </div>
    </div>
  </div>
</template>
