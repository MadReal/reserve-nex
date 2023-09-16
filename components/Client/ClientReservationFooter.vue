<script setup lang="ts">
interface Props {
  restaurant: Partial<Restaurant>;
  activeStep: number;
  isButtonDisabled: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits(["goBack", "addReservation"]);
</script>

<template>
  <div class="flex flex-col items-center px-4 pb-10 md_flex-row md_px-10" v-if="activeStep !== 4">
    <div>
      <p>{{ restaurant.name }}</p>
      <p class="-mt-1 text-xs text-gray-500">{{ restaurant.address }}, {{ restaurant.city }} {{ restaurant.zipCode }}</p>
    </div>
    <div class="mt-4 inline-flex gap-2 md_ml-auto md_mt-0">
      <button class="rounded bg-black p-2 text-white" v-if="activeStep === 1" @click="navigateTo('/reservation')">
        Torna Indietro
      </button>
      <button class="rounded bg-black p-2 text-white" v-else-if="activeStep !== 4" @click="$emit('goBack')">
        {{ activeStep === 1 ? "Torna Indietro" : "Annulla" }}
      </button>
      <button
        class="rounded bg-primary-100 p-2 text-white"
        v-if="activeStep === 3"
        :disabled="isButtonDisabled"
        :class="{ 'disabled_opacity-25': isButtonDisabled }"
        @click="$emit('addReservation')"
      >
        Conferma
      </button>
    </div>
  </div>
</template>
