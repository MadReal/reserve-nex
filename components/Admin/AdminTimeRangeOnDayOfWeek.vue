<script setup lang="ts">
import { storeToRefs } from "pinia";
import { vOnClickOutside } from "@vueuse/components";

interface SelectTimePeriodProps {
  blockTimeTimeRangeOnDayOfWeek: Block;
}
const props = defineProps<SelectTimePeriodProps>();

const storeBlocks = useBlocksStore();
const { blockedTimeRangeOnDayOfWeekList } = storeToRefs(storeBlocks);

const dayIsAlreadyInBlockedDaysList = (dayInt: number) =>
  blockedTimeRangeOnDayOfWeekList.value.some((e) => e.dayOfWeek === dayInt);

// API CALLS
const updateTimeSlot = (isTimeFrom: boolean, time: string) => {
  const block: Block = props.blockTimeTimeRangeOnDayOfWeek;
  if (isTimeFrom) block.timeStart = time;
  else block.timeEnd = time;

  // exit function if nulls
  if (block === null || block.timeEnd === null || block.timeStart === null) return;
  if ((isTimeFrom && block.timeEnd < time) || (!isTimeFrom && block.timeStart > time)) block.timeEnd = block.timeStart = time;
  updateBlockedTimeRangeOnDayOfWeek();
};

const updateDayOfWeek = (dayOfWeek: number) => {
  // if dayOfWeek was already selected, exit
  if (dayIsAlreadyInBlockedDaysList(dayOfWeek)) return;
  // otherwise update Block
  props.blockTimeTimeRangeOnDayOfWeek.dayOfWeek = dayOfWeek;
  updateBlockedTimeRangeOnDayOfWeek();
};

const updateBlockedTimeRangeOnDayOfWeek = () => {
  storeBlocks.updateBlockedTimeRangeOnDayOfWeek(
    props.blockTimeTimeRangeOnDayOfWeek.id,
    props.blockTimeTimeRangeOnDayOfWeek.timeStart,
    props.blockTimeTimeRangeOnDayOfWeek.timeEnd,
    props.blockTimeTimeRangeOnDayOfWeek.dayOfWeek,
  );
};

// Data Picker dropdown
const isDropdownOpen = ref(false);
const toggleDropdown = () => (isDropdownOpen.value = !isDropdownOpen.value);
const closeDropdown = () => (isDropdownOpen.value = false);
</script>

<template>
  <div
    class="mb-2 grid grid-cols-[1fr_1fr_2fr_min-content] items-center justify-between rounded-lg border xl_grid-cols-[1fr_1fr_3fr_min-content]"
    v-on-click-outside="closeDropdown"
  >
    <AdminSelectTimeRange
      :isTimeFrom="true"
      :time="blockTimeTimeRangeOnDayOfWeek.timeStart!"
      @updateBlockedTimeRangeOnDayOfWeek="updateTimeSlot"
    />
    <AdminSelectTimeRange
      :isTimeFrom="false"
      :time="blockTimeTimeRangeOnDayOfWeek.timeEnd!"
      @updateBlockedTimeRangeOnDayOfWeek="updateTimeSlot"
    />

    <div class="relative flex cursor-pointer items-center gap-1 border-l px-2 py-2 md_px-3" @click="toggleDropdown()">
      <p class="leading-normal text-grey-300">{{ useTranslateDayOfWeek(blockTimeTimeRangeOnDayOfWeek.dayOfWeek!) }}</p>
      <SVGIcon class="text-grey-300" svg="arrow-down" :size="15" />

      <ul class="absolute inset-x-0 top-12 z-10 max-h-40 overflow-y-scroll rounded-lg bg-white shadow-lg" v-show="isDropdownOpen">
        <li
          class="px-3 py-2 text-sm"
          :class="{
            'cursor-not-allowed bg-gray-50 text-gray-200 line-through': dayIsAlreadyInBlockedDaysList(dayInt),
            'cursor-pointer text-grey-300 hover_bg-gray-100': !dayIsAlreadyInBlockedDaysList(dayInt),
          }"
          v-for="dayInt in 7"
          :key="dayInt"
          @click="updateDayOfWeek(dayInt)"
        >
          <p>{{ useTranslateDayOfWeek(dayInt) }}</p>
        </li>
      </ul>
    </div>
    <div class="flex items-center px-2 py-2 md_px-3">
      <SVGIcon
        class="cursor-pointer text-grey-300 hover_text-error-200"
        svg="trash"
        :size="15"
        @click="storeBlocks.removeBlock(blockTimeTimeRangeOnDayOfWeek.id)"
      ></SVGIcon>
    </div>
  </div>
</template>
