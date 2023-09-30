<script setup lang="ts">
import { storeToRefs } from "pinia";

interface ClientBoxWorkTimeProps {
  time: WorkTime["time"];
  isSelected: boolean;
  dateSelected: Date;
}
const props = withDefaults(defineProps<ClientBoxWorkTimeProps>(), {
  isSelected: false,
});
const emit = defineEmits(["handleSelectTime"]);

import { useBlocksStore } from "~/stores/Blocks";
import { useDiscountsStore } from "~/stores/Discounts";
const storeBlocks = useBlocksStore();
const storeDiscounts = useDiscountsStore();
const { blockedTimeRangeOnDateList, blockedTimeRangeOnDayOfWeekList } = storeToRefs(storeBlocks);
const { discountsList } = storeToRefs(storeDiscounts);

const dayOfWeekSelected = computed(() => {
  const date = new Date(props.dateSelected);
  return date.getDay() === 0 ? 7 : date.getDay();
});

const blockedTimesToday = computed(() => {
  const bTimeRangeOnDayOfWeek = blockedTimeRangeOnDayOfWeekList.value.filter(
    (item) => item.dayOfWeek === dayOfWeekSelected.value,
  );
  // Use .filter() to create a new array with items that have the same date
  const bTimeRangeOnDate = blockedTimeRangeOnDateList.value.filter((item) => {
    const itemDate = new Date(item.date!);
    return itemDate.toDateString() === props.dateSelected.toDateString();
  });
  return [...bTimeRangeOnDayOfWeek, ...bTimeRangeOnDate];
});

// Function to convert time string to minutes
function convertTimeToMinutes(timeString: string) {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
}

// Get the current time as minutes since midnight
const now = new Date();
const currentMinutes = now.getHours() * 60 + now.getMinutes();

// Use the `Array.some()` method to check if `props.time` is within the range of any item
const isTimeBlocked = blockedTimesToday.value.some((item) => {
  // Convert time strings to minutes for comparison
  const timeToCheckMinutes = convertTimeToMinutes(props.time);
  const startTimeMinutes = convertTimeToMinutes(item.timeStart!);
  const endTimeMinutes = convertTimeToMinutes(item.timeEnd!);

  // Check if `timeToCheckMinutes` is between `startTimeMinutes` and `endTimeMinutes`
  return timeToCheckMinutes >= startTimeMinutes && timeToCheckMinutes <= endTimeMinutes;
});

// Check if the dateSelected is today and if `props.time` is in the past
const isTimePast = (() => {
  const selectedDate = props.dateSelected;
  const isToday =
    selectedDate.getDate() === now.getDate() &&
    selectedDate.getMonth() === now.getMonth() &&
    selectedDate.getFullYear() === now.getFullYear();

  // Convert time to minutes for comparison
  const timeToCheckMinutes = convertTimeToMinutes(props.time);
  // Check if the time is between 00:00 and 04:00
  const isBetweenMidnightAnd4AM = timeToCheckMinutes >= 0 && timeToCheckMinutes <= 4 * 60;

  return isToday && !isBetweenMidnightAnd4AM && timeToCheckMinutes < currentMinutes;
})();

const discountAmountOnTime = computed(
  () => discountsList.value.find((item) => item.workTime.time === props.time)?.discountAmount?.value,
);

function handleSelectTime(time: string) {
  if (isTimeBlocked || isTimePast) return;
  else emit("handleSelectTime", time, discountAmountOnTime.value);
}

const boxClasses = ref({
  "border-primary-100": props.isSelected,
  "cursor-not-allowed line-through decoration-grey-100 text-grey-100 hover_border-gray-100": isTimeBlocked || isTimePast,
  "cursor-pointer hover_border-primary-100": !isTimeBlocked && !isTimePast,
});
</script>

<template>
  <div
    class="group flex min-h-[4rem] flex-col items-center justify-center rounded-lg border border-gray-100 px-2 text-grey-200"
    :class="boxClasses"
    @click="handleSelectTime(time)"
  >
    <div
      class="flex items-center justify-center"
      :class="{
        'text-primary-100': isSelected,
        'group-hover_text-primary-100': !isTimeBlocked && !isTimePast,
        'cursor-not-allowed text-grey-100 hover_text-grey-100 group-hover_text-grey-100 ': isTimeBlocked || isTimePast,
      }"
    >
      <SVGIcon class="mr-1" svg="clock" :size="15" />
      <p>{{ time }}</p>
    </div>

    <div
      v-if="discountAmountOnTime"
      class="flex h-5 items-center justify-center whitespace-nowrap rounded-sm bg-red-500 px-1 text-center text-sm text-white"
      :class="{ 'opacity-10': isTimeBlocked || isTimePast }"
    >
      <p class="text-xs capitalize">
        <span class="relative -top-px text-[9px] tracking-tight"> {{ $t("client_reservation.discount") }} </span>
        {{ discountAmountOnTime }}%
      </p>
    </div>
  </div>
</template>
