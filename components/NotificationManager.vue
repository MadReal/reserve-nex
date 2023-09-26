<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useNotificationsStore } from "~/stores/Notifications";
const storeNotifications = useNotificationsStore();
const { activeNotification } = storeToRefs(storeNotifications);
</script>

<template>
  <Transition>
    <div
      v-if="activeNotification !== null"
      class="NotificationManager absolute inset-x-2 bottom-4 z-50 flex w-auto items-center rounded-lg px-3 py-2 text-white shadow md_bottom-10 md_left-auto md_right-7 md_min-w-[300px] md_px-4"
      :class="{ 'bg-green-400': activeNotification.isSuccess, 'bg-red-500': !activeNotification.isSuccess }"
    >
      <p class="text-sm">{{ activeNotification?.text }}</p>
      <div
        class="ml-auto cursor-pointer rounded-lg p-1"
        :class="{ 'hover_bg-green-500': activeNotification.isSuccess, 'hover_bg-red-600': !activeNotification.isSuccess }"
        @click="storeNotifications.closeNotification()"
      >
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
