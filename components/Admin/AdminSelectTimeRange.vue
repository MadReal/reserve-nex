<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";
import { storeToRefs } from "pinia";

interface Props {
  isTimeFrom: boolean;
  time: string;
}
const props = defineProps<Props>();
const emit = defineEmits(["updateBlockedTimeRange"]);

const storeWorkTimes = useWorkTimesStore();
const { workTimesListsSorted } = storeToRefs(storeWorkTimes);

const isDropdownOpen = ref(false);
const toggleDropdown = () => (isDropdownOpen.value = !isDropdownOpen.value);
const closeDropdown = () => (isDropdownOpen.value = false);
</script>

<template>
  <div class="col-span-2 min-w-[100%] border-b first_border-r md_col-span-1 md_border-0" v-on-click-outside="closeDropdown">
    <div
      class="relative flex cursor-pointer items-center justify-center gap-1 px-2 py-2 md_justify-stretch md_px-3"
      @click="toggleDropdown()"
    >
      <p class="pr-1 text-xxs leading-normal text-grey-200">{{ isTimeFrom ? "From" : "To" }}</p>
      <p class="leading-normal text-grey-300">{{ time }}</p>
      <div><SVGIcon class="text-grey-300" svg="arrow-down" :size="15" /></div>

      <div
        class="absolute inset-x-0 top-12 z-10 max-h-40 overflow-y-scroll rounded-lg bg-white shadow-lg"
        v-show="isDropdownOpen"
      >
        <p
          class="px-3 py-2"
          v-for="workTime in workTimesListsSorted"
          :key="workTime.id"
          @click="$emit('updateBlockedTimeRange', isTimeFrom, workTime.time)"
          :class="{
            'cursor-not-allowed bg-gray-50 text-gray-200 line-through': workTime.time === time,
            'cursor-pointer text-grey-300 hover_bg-gray-100': workTime.time !== time,
          }"
        >
          {{ workTime.time }}
        </p>
      </div>
    </div>
  </div>
</template>
