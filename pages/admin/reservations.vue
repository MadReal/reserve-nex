<script setup lang="ts">
definePageMeta({ middleware: ['empty-restaurants-list', 'auth'], layout: 'admin-default' })
useHead({ title: 'Prenotazioni', })

import { storeToRefs } from 'pinia'
import { useReservationsStore } from '@/stores/Reservations';

const storeReservations = useReservationsStore();
const { reservationsList } = storeToRefs(storeReservations)
const { openModal } = useOpenModal();

const noData = computed(() => (!reservationsList.value.length))
</script>


<template lang="pug">
.page__content
    AdminPageTitle(title="Prenotazioni")

    AdminNoData(v-if="noData", text="Nessuna prenotazione in elenco.")

    .mb-8(v-else)
        .py-4.flex.items-center.flex-wrap.font-medium.gap-5.border-b(v-for="item in reservationsList", :key="item.id")
            .basis-60.overflow-hidden
                p.text-black.font-semibold.tracking-wide.whitespace-nowrap.truncate.underline.cursor-pointer.hover_opacity-80(@click="openModal('reservation', item.id)") {{ item.personName }}
                p.text-grey-200.tracking-tight(class="text-[10px]") {{ `#${item.id}` }}
            .h-full.border-l.w-px
            p.antialiased {{ useDateFormatting(item.date) }}
            .flex.items-center.text-primary-100.antialiased
                SVGIcon.pr-1(svg="users-filled", :size="20")
                p {{ item.peopleAmount }}
            .flex.items-center.text-grey-100
                SVGIcon.pr-1(svg="clock", :size="20")
                p {{ item.time }}
            .flex.items-center.text-red-500.antialiased(v-if="item.discountAmount")
                SVGIcon.pr-1(svg="discount", :size="20")
                p {{ item.discountAmount }}% #[span(class="text-[11px] tracking-tight") Sconto]

            .flex.gap-2.lg_ml-auto
                a.py-1.px-3.rounded.bg-success-100.text-success-300.cursor-not-allowed(v-if="item.accepted === true") Accettata
                a.py-1.px-3.rounded.bg-error-100.text-error-300.cursor-not-allowed(v-if="item.accepted === false") Rifiutata
                a.py-1.px-3.rounded.bg-success-200.text-white.cursor-pointer(class="hover_bg-success-200/80", 
                    v-if="item.accepted === null" @click="storeReservations.updateReservation(item.id, true)") Accetta
                a.py-1.px-3.rounded.bg-error-200.text-white.cursor-pointer(class="hover_bg-error-200/80", 
                    v-if="item.accepted === null" @click="storeReservations.updateReservation(item.id, false)") Rifiuta
</template>