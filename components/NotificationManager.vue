<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useNotificationsStore } from "~/stores/Notifications";
import { vOnClickOutside } from "@vueuse/components";

const storeNotifications = useNotificationsStore();
const { activeNotification } = storeToRefs(storeNotifications);
</script>

<template>
  <Transition>
    <div
      class="NotificationManager absolute inset-x-2 bottom-4 z-50 flex w-auto items-center rounded-lg bg-green-400 px-3 py-2 text-white shadow md_bottom-10 md_left-auto md_right-7 md_min-w-[300px] md_px-4"
      v-if="activeNotification !== null"
    >
      <p class="text-sm">{{ activeNotification?.text }}</p>
      <div class="ml-auto cursor-pointer rounded-lg p-1 hover_bg-green-500" @click="storeNotifications.closeNotification()">
        <SVGIcon class="" svg="close" :size="24" />
      </div>
    </div>
  </Transition>
</template>

<style>
/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  transform: translateX(200px);
  opacity: 0;
}
</style>
