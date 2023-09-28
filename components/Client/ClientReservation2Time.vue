<script setup lang="ts">
import { storeToRefs } from "pinia";
interface Props {
  reservation: Partial<Reservation>;
}
const props = defineProps<Props>();
const emit = defineEmits(["setReservationTimeAndDiscountAmount"]);

const storeWorkTimes = useWorkTimesStore();
const { lunchWorkTimesList, dinnerWorkTimesList } = storeToRefs(storeWorkTimes);
</script>

<template>
  <div class="px-4 py-6 md_px-10" v-if="reservation && reservation.date">
    <ClientReservationInfo :reservationDate="reservation.date" />
    <div class="md_my-6" v-if="lunchWorkTimesList.length">
      <p class="mb-4">Pranzo</p>
      <div class="my-3 grid grid-cols-3 gap-2 md_grid-cols-5">
        <ClientBoxWorkTime
          v-for="workTime in lunchWorkTimesList"
          :key="workTime.id"
          :time="workTime.time"
          :dateSelected="reservation.date"
          :isSelected="workTime.time === reservation.time"
          @handleSelectTime="($time, $discountAmount) => emit('setReservationTimeAndDiscountAmount', $time, $discountAmount)"
        />
      </div>
    </div>

    <div class="md_my-6" v-if="dinnerWorkTimesList.length">
      <p class="mb-4">Cena</p>
      <div class="my-3 grid grid-cols-3 gap-2 md_grid-cols-5">
        <ClientBoxWorkTime
          v-for="workTime in dinnerWorkTimesList"
          :key="workTime.id"
          :time="workTime.time"
          :dateSelected="reservation.date"
          :isSelected="workTime.time === reservation.time"
          @handleSelectTime="($time, $discountAmount) => emit('setReservationTimeAndDiscountAmount', $time, $discountAmount)"
        />
      </div>
    </div>
  </div>
</template>
