<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useModalsStore } from "~/stores/Modals";
import { useReservationsStore } from "~/stores/Reservations";

const storeModals = useModalsStore();
const storeReservations = useReservationsStore();
const { activeModalOption } = storeToRefs(storeModals);
const { reservationsList } = storeToRefs(storeReservations);

const selectedReservation = ref(
  reservationsList.value.filter(
    (item: Reservation) => item.id === activeModalOption.value,
  )[0],
);
const instagramName = ref(
  selectedReservation.value.personInstagram
    ? selectedReservation.value.personInstagram.includes("@")
      ? selectedReservation.value.personInstagram
      : `@${selectedReservation.value.personInstagram}`
    : "-",
);

const updateReservation = async (
  reservationId: Reservation["id"],
  isAccepted: boolean,
) => {
  if (
    confirm(
      "Sicuro di voler rifiutare la prenotazione? \nSe procedi, il cliente verrà informato della cancellazione.",
    )
  ) {
    await storeReservations.updateReservation(reservationId, isAccepted);
    storeModals.closeModal();
  }
};
</script>

<template lang="pug">
.flex.items-center.justify-center.h-full
	.text-center.basis-full
		p.text-lg.font-semibold.mb-4 Prenotazione


		//- desktop
		table.hidden.md_table.table-fixed.border-collapse.w-full.border.border-slate-400.bg-white.text-sm.text-left.shadow-sm
			tbody
				tr
					td.w-28.border.p-3.text-grey-300 ID
					td.border.p-3.text-grey-200 {{ `#${selectedReservation.id}` }}
				tr
					td.w-28.border.p-3.text-grey-300 Data
					td.border.p-3.text-grey-200 {{ useDateFormatting(selectedReservation.date) }} #[span.ml-2.text-grey-300.font-medium Orario #[span.text-grey-300.font-semibold {{ selectedReservation.time }}]]
				tr
					td.w-28.border.p-3.text-grey-300 Persone
					td.border.p-3.text-grey-200 {{ selectedReservation.peopleAmount }}
				tr
					td.w-28.border.p-3.text-red-500 Sconto
					td.border.p-3.text-red-500 {{ selectedReservation.discountAmount }}{{ selectedReservation.discountAmount ? '%' : '' }}
				tr
					td.w-28.border.p-3.text-grey-300 Nome
					td.border.p-3.text-grey-200 {{ selectedReservation.personName }}					
				tr
					td.w-28.border.p-3.text-grey-300 Telefono
					td.border.p-3.text-grey-200 {{ selectedReservation.personPhone }}
				tr
					td.w-28.border.p-3.text-grey-300 Email
					td.border.p-3.text-grey-200 {{ selectedReservation.personEmail }}
				tr
					td.w-28.border.p-3.text-grey-300 Instagram
					td.border.p-3.text-grey-200 {{ instagramName }}
	
				tr.bg-slate-100(v-if="selectedReservation.accepted === true")
					td.w-28.border.p-3.text-grey-300 Stato
					td.border.p-3.text-success-200.font-semibold Accettata

				tr.bg-slate-100(v-if="selectedReservation.accepted === false")
					td.w-28.border.p-3.text-grey-300 Stato
					td.border.p-3.text-error-200.font-semibold Rifiutata


		//- mobile
		.w-full.bg-white.text-sm.text-left.md_hidden
			ul
				li.mb-2
					p.text-grey-300 ID:
					p.text-xs.text-grey-200 {{ `#${selectedReservation.id}` }}
				li.mb-2
					p.text-grey-300 Data:
					p.text-sm.text-grey-200 {{ useDateFormatting(selectedReservation.date) }} #[span.ml-2.text-grey-300.font-medium Orario #[span.text-grey-300.font-semibold {{ selectedReservation.time }}]]
				li.mb-2
					p.text-grey-300 #[span.font-medium Persone:] {{ selectedReservation.peopleAmount }}
				li.mb-2
					p.text-red-500 #[span.font-medium Sconto:] {{ selectedReservation.discountAmount }}{{ selectedReservation.discountAmount ? '%' : '' }}					
				li.mb-2
					p.text-grey-300 Nome:
					p.text-sm.text-grey-200 {{ selectedReservation.personName }}
				li.mb-2
					p.text-grey-300 Telefono:
					p.text-sm.text-grey-200 {{ selectedReservation.personPhone }}
				li.mb-2
					p.text-grey-300 Email:
					p.text-sm.text-grey-200 {{ selectedReservation.personEmail }}
				li.mb-2
					p.text-grey-300 Instagram: 
					p.text-sm.text-grey-200 {{ instagramName }}

					//- p.text-sm.text-grey-200 {{ instagramName }}
				li.mb-2(v-if="selectedReservation.accepted === true")
					p.text-grey-300 Stato:
					p.text-sm.text-success-200.font-semibold Accettata


		.mt-5.flex.items-center.justify-center.gap-2.text-sm.md_text-base.uppercase
			//- button.py-2.px-4.rounded.text-success-200.cursor-not-allowed(v-if="selectedReservation.accepted === true") Accettata
			//- button.py-2.px-4.rounded.bg-error-100.text-error-300.cursor-not-allowed(v-if="selectedReservation.accepted === false") Rifiutata
			button.py-2.px-4.rounded.bg-success-200.text-white.text-sm.uppercase.font-medium.cursor-pointer(class="hover_bg-success-200/80", 
				v-if="selectedReservation.accepted === null" @click="updateReservation(selectedReservation.id, true)") Accetta
			button.py-2.px-4.rounded.bg-error-200.text-white.text-sm.uppercase.font-medium.cursor-pointer(class="hover_bg-error-200/80", 
				v-if="selectedReservation.accepted !== false" @click="updateReservation(selectedReservation.id, false)") Rifiuta Prenotazione
</template>
