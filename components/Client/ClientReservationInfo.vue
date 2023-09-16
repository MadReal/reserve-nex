<script setup lang="ts">
interface Props {
  reservationDate: Date;
  reservationTime?: string;
  reservationDiscountAmount?: number;
  restaurant?: Partial<Restaurant>;
}
const props = defineProps<Props>();
</script>

<template>
  <div class="mb-5 border-b pb-5 md_mb-0">
    <div class="flex flex-wrap items-center gap-x-3 gap-y-2 md_gap-x-5">
      <div class="flex items-center gap-1">
        <SVGIcon class="text-grey-100" svg="calendar" :size="18"></SVGIcon>
        <p class="text-sm text-grey-300">{{ useDateFormatting(reservationDate) }}</p>
      </div>

      <div class="flex items-center gap-1" v-if="reservationTime">
        <SVGIcon class="text-grey-100" svg="clock" :size="16"></SVGIcon>
        <p class="text-sm text-grey-300">{{ reservationTime }}</p>
      </div>

      <div class="flex items-center gap-1 whitespace-nowrap" v-if="reservationDiscountAmount">
        <SVGIcon class="text-red-500" svg="discount" :size="16"></SVGIcon>
        <p class="text-sm text-red-400"><span class="text-xs tracking-tight">Sconto</span> {{ reservationDiscountAmount }}%</p>
      </div>
    </div>
    <p class="pt-3 text-xs text-grey-100" v-if="restaurant">
      Stai prenotando per {{ restaurant.name }} - {{ restaurant.address }}, {{ restaurant.city }}
      {{ restaurant.zipCode }}
    </p>
  </div>
</template>
