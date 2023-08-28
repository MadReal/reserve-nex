<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useReservationsStore } from '@/stores/Reservations';

definePageMeta({
    middleware: ['auth']
})

const storeReservations = useReservationsStore();
const { reservationsList } = storeToRefs(storeReservations)
const formatDate = (date: string) => useDateTimeFormatting(date).formattedDate

onBeforeMount(async () => { await storeReservations.fetchResevations() });
</script>


<template lang="pug">
.page
    PageTitle(title="Prenotazioni")

    .mb-8
        .flex.items-center.gap-5.py-5.border-b.font-medium(v-for="item in reservationsList", :key="item.id")
            p.inline
                span.pr-1.text-black.font-semibold.underline {{ item.personName }}
                span.text-grey-200.text-xs {{ `[#${item.id}]` }}
            p.antialiased {{ formatDate(item.date) }}
            .flex.items-center.text-primary-100.antialiased
                SVGIcon.pr-1(svg="users-filled", :size="20")
                p {{ item.peopleAmount }}
            .flex.items-center.text-grey-100.antialiased
                SVGIcon.pr-1(svg="clock", :size="20")
                p {{ item.time }}

            .ml-auto.flex.gap-2
                a.py-1.px-3.rounded.bg-success-100.text-success-300.cursor-not-allowed(v-if="item.accepted === true") Accettata
                a.py-1.px-3.rounded.bg-error-100.text-error-300.cursor-not-allowed(v-if="item.accepted === false") Rifiutata
                a.py-1.px-3.rounded.bg-success-200.text-white.cursor-pointer(class="hover_bg-success-200/80", 
                    v-if="item.accepted === null" @click="storeReservations.updateReservation(item.id, true)") Accetta
                a.py-1.px-3.rounded.bg-error-200.text-white.cursor-pointer(class="hover_bg-error-200/80", 
                    v-if="item.accepted === null" @click="storeReservations.updateReservation(item.id, false)") Rifiuta
</template>