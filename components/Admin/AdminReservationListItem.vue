<script setup lang="ts">
interface AdminReservationListItemProps {
  reservation: Reservation;
}
const props = defineProps<AdminReservationListItemProps>();

const { openModal } = useOpenModal();
</script>

<template>
  <li
    class="group flex flex-wrap items-center gap-5 border-b py-4 font-medium hover_bg-slate-50"
  >
    <div class="basis-60 overflow-hidden">
      <p
        class="cursor-pointer truncate whitespace-nowrap font-semibold tracking-wide text-black underline hover_opacity-80"
        @click="openModal('reservation', reservation.id)"
      >
        {{ reservation.personName }}
      </p>
      <p class="text-[10px] tracking-tight text-grey-200">
        {{ `#${reservation.id}` }}
      </p>
    </div>
    <div class="h-full w-px border-l"></div>
    <p class="antialiased">{{ useDateFormatting(reservation.date) }}</p>
    <div class="flex items-center text-primary-100 antialiased">
      <SVGIcon class="pr-1" svg="users-filled" :size="20"></SVGIcon>
      <p>{{ reservation.peopleAmount }}</p>
    </div>
    <div class="flex items-center text-grey-100">
      <SVGIcon class="pr-1" svg="clock" :size="20"></SVGIcon>
      <p>{{ reservation.time }}</p>
    </div>
    <div
      class="flex items-center text-red-500 antialiased"
      v-if="reservation.discountAmount"
    >
      <SVGIcon class="pr-1" svg="discount" :size="20"></SVGIcon>
      <p>
        {{ reservation.discountAmount }}%
        <span class="text-[11px] tracking-tight">Sconto</span>
      </p>
    </div>
    <div class="flex items-center gap-2 lg_ml-auto">
      <p
        class="rounded p-1 text-success-200"
        v-if="reservation.accepted === true"
      >
        Accettata
      </p>
      <p
        class="rounded p-1 text-error-200"
        v-if="reservation.accepted === false"
      >
        Rifiutata
      </p>
      <a
        class="hidden cursor-pointer p-1 text-grey-200 hover_text-grey-300 group-hover_block"
      >
        <SVGIcon
          svg="edit"
          @click="openModal('reservation', reservation.id)"
        ></SVGIcon>
      </a>
    </div>
  </li>
</template>
