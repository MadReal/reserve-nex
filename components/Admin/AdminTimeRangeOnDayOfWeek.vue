<script setup lang="ts">
import { storeToRefs } from "pinia";
import { vOnClickOutside } from "@vueuse/components";

interface Props {
  blockTimeTimeRangeOnDayOfWeek: Block;
}
const props = defineProps<Props>();

const storeBlocks = useBlocksStore();
const { blockedTimeRangeOnDayOfWeekList } = storeToRefs(storeBlocks);

const dayIsAlreadyInBlockedDaysList = (dayInt: number) =>
  blockedTimeRangeOnDayOfWeekList.value.some((e) => e.dayOfWeek === dayInt);

// API CALLS
const updateTimeSlot = (isTimeFrom: boolean, time: string) => {
  const block: Block = props.blockTimeTimeRangeOnDayOfWeek;
  useUpdateTimeSlot(block, isTimeFrom, time, updateBlockedTimeRangeOnDayOfWeek);
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
const isDropdownDayOfWeekOpen = ref(false);
const toggleDropdownDayOfWeek = () => (isDropdownDayOfWeekOpen.value = !isDropdownDayOfWeekOpen.value);
const closeDropdownDayOfWeek = () => (isDropdownDayOfWeekOpen.value = false);
</script>

<template>
  <div
    class="mb-2 grid grid-cols-4 items-center justify-between rounded-lg border md_grid-cols-[1fr_1fr_2fr_min-content] xl_grid-cols-[1fr_1fr_3fr_min-content]"
  >
    <AdminSelectTimeRange
      :isTimeFrom="true"
      :time="blockTimeTimeRangeOnDayOfWeek.timeStart!"
      @updateBlockedTimeRange="updateTimeSlot"
    />
    <AdminSelectTimeRange
      :isTimeFrom="false"
      :time="blockTimeTimeRangeOnDayOfWeek.timeEnd!"
      @updateBlockedTimeRange="updateTimeSlot"
    />

    <div
      v-on-click-outside="closeDropdownDayOfWeek"
      class="relative col-span-3 flex cursor-pointer items-center justify-center gap-1 border-r px-2 py-2 md_col-span-1 md_justify-normal md_border-l md_px-3"
      @click="toggleDropdownDayOfWeek()"
    >
      <p class="leading-normal text-grey-300">{{ useTranslateDayOfWeek(blockTimeTimeRangeOnDayOfWeek.dayOfWeek!) }}</p>
      <SVGIcon class="text-grey-300" svg="arrow-down" :size="15" />

      <ul
        class="absolute inset-x-0 top-12 z-10 max-h-40 overflow-y-scroll rounded-lg bg-white shadow-lg"
        v-show="isDropdownDayOfWeekOpen"
      >
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

    <div class="flex items-center justify-center px-2 py-2 md_px-3">
      <SVGIcon
        class="cursor-pointer text-grey-300 hover_text-error-200"
        svg="trash"
        :size="15"
        @click="storeBlocks.removeBlock(blockTimeTimeRangeOnDayOfWeek.id)"
      />
    </div>
  </div>
</template>
