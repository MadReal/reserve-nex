<script setup lang="ts">
interface Props {
  reservation: Partial<Reservation>;
  restaurant: Restaurant;
}
const props = defineProps<Props>();
const emit = defineEmits([]);
</script>

<template>
  <div class="flex items-center justify-center gap-5 px-4 py-16 md_px-10 md_py-24">
    <div class="text-center">
      <SVGIcon class="mx-auto mb-4 text-primary-100" svg="check" :size="60" />
      <p class="text-base md_text-lg">{{ $t("client_reservation.congrats") }} {{ reservation.personName }},</p>
      <p class="mt-1 text-sm md_text-base">
        {{ $t("client_reservation.wait_on_day") }} {{ useDateFormatting(reservation.date!) }}
        {{ $t("client_reservation.at_time") }} {{ reservation.time }}
      </p>
      <p class="mt-4 text-xs leading-relaxed text-primary-100">
        {{ $t("client_reservation.order") }} ID: <span class="rounded bg-slate-100 p-1">{{ reservation.id }}</span>
      </p>
      <p class="mt-5 border-t pt-4 text-sm text-grey-200">
        {{ restaurant.name }} - {{ restaurant.address }}, {{ restaurant.city }} {{ restaurant.zipCode }}
      </p>
    </div>
  </div>
</template>
