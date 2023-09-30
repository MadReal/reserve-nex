<script setup lang="ts">
interface AdminReservationListItemProps {
  reservation: Reservation;
}
const props = defineProps<AdminReservationListItemProps>();

const { openModal } = useOpenModal();
</script>

<template>
  <li class="group flex flex-wrap items-center gap-x-3 gap-y-1 border-b py-3 font-medium hover_bg-slate-50 md_gap-x-5">
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
      <SVGIcon class="pr-1" svg="users-filled" :size="20" />
      <p>{{ reservation.peopleAmount }}</p>
    </div>
    <div class="flex items-center text-grey-100">
      <SVGIcon class="pr-1" svg="clock" :size="20" />
      <p>{{ reservation.time }}</p>
    </div>
    <div class="flex items-center text-red-500 antialiased" v-if="reservation.discountAmount">
      <SVGIcon class="pr-1" svg="discount" :size="20" />
      <p class="capitalize">
        {{ reservation.discountAmount }}%
        <span class="text-[11px] tracking-tight">{{ $t("modal.reservation.discount") }}</span>
      </p>
    </div>
    <div class="flex items-center gap-2 capitalize md_ml-auto">
      <p class="rounded p-1 text-success-200" v-if="reservation.accepted === true">
        {{ $t("modal.reservation.status_accepted") }}
      </p>
      <p class="rounded p-1 text-error-200" v-if="reservation.accepted === false">
        {{ $t("modal.reservation.status_cancelled") }}
      </p>
      <a class="hidden cursor-pointer p-1 text-grey-200 hover_text-grey-300 group-hover_block">
        <SVGIcon svg="edit" @click="openModal('reservation', reservation.id)" />
      </a>
    </div>
  </li>
</template>
