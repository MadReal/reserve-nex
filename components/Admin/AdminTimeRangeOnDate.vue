<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { vOnClickOutside } from "@vueuse/components";

interface SelectTimePeriodProps {
  blockTimePeriod: Block;
}
const props = defineProps<SelectTimePeriodProps>();

const storeBlocks = useBlocksStore();

const disabledDates = computed(() => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

  const disabledDatesArray = [];
  for (let i = new Date(0); i < today; i.setDate(i.getDate() + 1)) {
    disabledDatesArray.push(new Date(i));
  }
  return disabledDatesArray;
});

// API CALLS
const updateTimeSlot = (isTimeFrom: boolean, time: string) => {
  const block: Block = props.blockTimePeriod;
  useUpdateTimeSlot(block, isTimeFrom, time, updateBlockedTimeRangeOnDate);
};

const updateBlockedTimeRangeOnDate = () => {
  storeBlocks.updateBlockedTimeRangeOnDate(
    props.blockTimePeriod.id,
    props.blockTimePeriod.timeStart,
    props.blockTimePeriod.timeEnd,
    props.blockTimePeriod.date,
  );
};

// Data Picker dropdown
const isDropdownCalendarOpen = ref(false);
const toggleDropdownCalendar = () => {
  isDropdownCalendarOpen.value = !isDropdownCalendarOpen.value;
  updateBlockedTimeRangeOnDate();
};
const closeDropdownCalendar = () => (isDropdownCalendarOpen.value = false);
</script>

<template>
  <div
    class="mb-2 grid grid-cols-[1fr_1fr_2fr_min-content] items-center justify-between rounded-lg border xl_grid-cols-[1fr_1fr_3fr_min-content]"
    v-on-click-outside="closeDropdownCalendar"
  >
    <AdminSelectTimeRange :isTimeFrom="true" :time="blockTimePeriod.timeStart!" @updateBlockedTimeRange="updateTimeSlot" />
    <AdminSelectTimeRange :isTimeFrom="false" :time="blockTimePeriod.timeEnd!" @updateBlockedTimeRange="updateTimeSlot" />

    <div class="relative flex cursor-pointer items-center gap-1 border-l px-2 py-2 md_px-3" @click="toggleDropdownCalendar()">
      <p class="leading-normal text-grey-300">{{ useDateFormatting(blockTimePeriod.date!) }}</p>
      <div
        class="absolute right-0 top-12 z-10 h-fit rounded-lg bg-white shadow-lg md_left-0 md_right-auto"
        v-show="isDropdownCalendarOpen"
      >
        <VueDatePicker
          v-model="blockTimePeriod.date"
          locale="it"
          :month-change-on-scroll="false"
          :enable-time-picker="false"
          inline
          auto-apply
          :state="true"
          @update:model-value="toggleDropdownCalendar()"
          :disabled-dates="disabledDates"
        ></VueDatePicker>
      </div>
    </div>

    <div class="flex items-center px-2 py-2 md_px-3">
      <SVGIcon
        class="cursor-pointer text-grey-300 hover_text-error-200"
        svg="trash"
        :size="15"
        @click="storeBlocks.removeBlock(blockTimePeriod.id)"
      />
    </div>
  </div>
</template>

<style>
:root {
  --dp-font-family: "Poppins", sans-serif;
}
</style>
