<script setup lang="ts">
import { storeToRefs } from "pinia";
import { vOnClickOutside } from "@vueuse/components";

const storeModals = useModalsStore();
const { activeModal } = storeToRefs(storeModals);

watch(
  () => activeModal.value,
  () => {
    if (activeModal.value) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
  },
);
</script>

<template>
  <div
    class="modalManager fixed inset-0 z-50 flex items-baseline justify-center overflow-y-scroll bg-black/80 sm_items-center"
    v-if="activeModal !== null"
  >
    <div
      class="relative my-6 w-11/12 overflow-y-clip rounded-lg border border-slate-100 bg-white px-6 py-8 md_w-4/12 md_min-w-[36rem] md_p-12 md_pb-16"
      v-on-click-outside="storeModals.closeModal"
    >
      <div class="absolute right-3 top-3 cursor-pointer rounded-full border border-black p-0.5 hover_bg-slate-100">
        <SVGIcon class="text-black" svg="close" :size="24" @click="storeModals.closeModal()" />
      </div>
      <ModalRestaurant v-if="activeModal === 'restaurant'"></ModalRestaurant>
      <ModalReservation v-else-if="activeModal === 'reservation'"></ModalReservation>
    </div>
  </div>
</template>
