<script setup lang="ts">
interface Props {
  activeStep: number;
}
const props = defineProps<Props>();
const emit = defineEmits(["goToStep"]);
</script>

<template>
  <div class="relative grid grid-cols-4 rounded-t-lg border bg-slate-50">
    <div class="absolute inset-x-0 inset-y-0 z-0 mx-10">
      <div class="absolute inset-x-0 top-1/2 h-1 w-full border-b"></div>
    </div>

    <ClientReservationStepItem :stepNumber="1" :activeStepNumber="activeStep" icon="calendar" @click="$emit('goToStep', 1)" />
    <ClientReservationStepItem :stepNumber="2" :activeStepNumber="activeStep" icon="clock" @click="$emit('goToStep', 2)" />
    <ClientReservationStepItem :stepNumber="3" :activeStepNumber="activeStep" icon="users-filled" @click="$emit('goToStep', 3)" />
    <ClientReservationStepItem :stepNumber="4" :activeStepNumber="activeStep" icon="check" @click="$emit('goToStep', 4)" />
  </div>
</template>
