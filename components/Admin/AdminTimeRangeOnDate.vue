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
    class="mb-2 grid grid-cols-4 items-center justify-between rounded-lg border md_grid-cols-[1fr_1fr_2fr_min-content] xl_grid-cols-[1fr_1fr_3fr_min-content]"
  >
    <AdminSelectTimeRange :isTimeFrom="true" :time="blockTimePeriod.timeStart!" @updateBlockedTimeRange="updateTimeSlot" />
    <AdminSelectTimeRange :isTimeFrom="false" :time="blockTimePeriod.timeEnd!" @updateBlockedTimeRange="updateTimeSlot" />

    <div
      v-on-click-outside="closeDropdownCalendar"
      class="relative col-span-3 flex cursor-pointer items-center justify-center gap-1 border-r px-2 py-2 md_col-span-1 md_justify-normal md_border-l md_px-3"
    >
      <p class="leading-normal text-grey-300" @click="toggleDropdownCalendar()">{{ useDateFormatting(blockTimePeriod.date!) }}</p>
      <div
        class="absolute -right-16 left-0 top-12 z-10 h-fit rounded-lg bg-white shadow-lg md_left-0 md_right-auto"
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
        />
      </div>
    </div>

    <div class="flex items-center justify-center px-2 py-2 md_px-3">
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
