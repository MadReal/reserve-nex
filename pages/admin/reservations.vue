<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'empty-restaurants-list'] })

import { storeToRefs } from 'pinia'
import { useReservationsStore } from '@/stores/Reservations';

const storeReservations = useReservationsStore();
const { reservationsList } = storeToRefs(storeReservations)
const formatDate = (date: string) => useDateTimeFormatting(date).formattedDate
const { openModal } = useOpenModal();

const noData = computed(() => (!reservationsList.value.length))
// storeReservations.fetchReservations()
</script>


<template lang="pug">
.page
    PageTitle(title="Prenotazioni")

    NoData(v-if="noData", text="Nessuna prenotazione prevista.")

    .mb-8(v-else)
        .flex.items-center.flex-wrap.gap-5.py-5.border-b.font-medium(v-for="item in reservationsList", :key="item.id")
            .inline
                span.pr-1.text-black.font-semibold.underline.cursor-pointer.hover_opacity-80(@click="openModal('reservation', item.id)") {{ item.personName }}
                span.text-grey-200.text-xs {{ `[#${item.id}]` }}
            p.antialiased {{ formatDate(item.date) }}
            .flex.items-center.text-primary-100.antialiased
                SVGIcon.pr-1(svg="users-filled", :size="20")
                p {{ item.peopleAmount }}
            .flex.items-center.text-grey-100.antialiased
                SVGIcon.pr-1(svg="clock", :size="20")
                p {{ item.time }}

            .flex.gap-2.lg_ml-auto
                a.py-1.px-3.rounded.bg-success-100.text-success-300.cursor-not-allowed(v-if="item.accepted === true") Accettata
                a.py-1.px-3.rounded.bg-error-100.text-error-300.cursor-not-allowed(v-if="item.accepted === false") Rifiutata
                a.py-1.px-3.rounded.bg-success-200.text-white.cursor-pointer(class="hover_bg-success-200/80", 
                    v-if="item.accepted === null" @click="storeReservations.updateReservation(item.id, true)") Accetta
                a.py-1.px-3.rounded.bg-error-200.text-white.cursor-pointer(class="hover_bg-error-200/80", 
                    v-if="item.accepted === null" @click="storeReservations.updateReservation(item.id, false)") Rifiuta
</template>