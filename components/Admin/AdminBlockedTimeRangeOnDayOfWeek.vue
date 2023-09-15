<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";
import { useBlocksStore } from "~/stores/Blocks";

interface SelectTimePeriodProps {
  blockTimeTimeRangeOnDayOfWeek: Block;
}
const props = defineProps<SelectTimePeriodProps>();

const storeBlocks = useBlocksStore();
// API CALLS
const updateTimeSlot = (isTimeFrom: boolean, time: string) => {
  const block: Block = props.blockTimeTimeRangeOnDayOfWeek;
  if (isTimeFrom) block.timeStart = time;
  else block.timeEnd = time;

  // exit function if nulls
  if (block === null || block.timeEnd === null || block.timeStart === null) return;

  if ((isTimeFrom && block.timeEnd < time) || (!isTimeFrom && block.timeStart > time)) block.timeEnd = block.timeStart = time;
  updateBlockedTimeRangeOnDate();
};

const updateBlockedTimeRangeOnDate = () => {
  storeBlocks.updateBlockedTimeRangeOnDate(
    props.blockTimeTimeRangeOnDayOfWeek.id,
    props.blockTimeTimeRangeOnDayOfWeek.timeStart,
    props.blockTimeTimeRangeOnDayOfWeek.timeEnd,
    props.blockTimeTimeRangeOnDayOfWeek.date,
  );
};

// Data Picker dropdown
const isDropdownOpen = ref(false);
const toggleDropdown = () => (isDropdownOpen.value = !isDropdownOpen.value);
const closeDropdown = () => (isDropdownOpen.value = false);
</script>

<template>
  <div
    class="mb-2 grid grid-cols-[1fr_1fr_3fr_min-content] items-center justify-between rounded-lg border"
    v-on-click-outside="closeDropdown"
  >
    <AdminSelectTimeRange
      :isTimeFrom="true"
      :time="blockTimeTimeRangeOnDayOfWeek.timeStart!"
      @updateBlockedTimeRangeOnDate="updateTimeSlot"
    />
    <AdminSelectTimeRange
      :isTimeFrom="false"
      :time="blockTimeTimeRangeOnDayOfWeek.timeEnd!"
      @updateBlockedTimeRangeOnDate="updateTimeSlot"
    />

    <div class="relative flex cursor-pointer items-center gap-1 border-l px-2 py-2 lg_px-3" @click="toggleDropdown()">
      <p class="leading-normal text-grey-300">{{ useTranslateDayOfWeek(blockTimeTimeRangeOnDayOfWeek.dayOfWeek!) }}</p>
      <ul class="absolute inset-x-0 top-12 z-10 max-h-40 overflow-y-scroll rounded-lg bg-white shadow-lg" v-show="isDropdownOpen">
        <li class="px-3 py-2 text-sm text-grey-300 hover_bg-gray-100" v-for="dayInt in 7" :key="dayInt">
          <p>{{ useTranslateDayOfWeek(dayInt) }}</p>
        </li>
      </ul>
    </div>
    <div class="flex items-center px-2 py-2 lg_px-3">
      <SVGIcon
        class="cursor-pointer text-grey-300 hover_text-error-200"
        svg="trash"
        :size="15"
        @click="storeBlocks.removeBlock(blockTimeTimeRangeOnDayOfWeek.id)"
      ></SVGIcon>
    </div>
  </div>
</template>
