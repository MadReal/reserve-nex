<script setup lang="ts">
const emit = defineEmits(["setReservationDate"]);

const { locale } = useI18n();
const isIT = computed(() => locale.value === "it");

// https://github.com/fullcalendar/fullcalendar-vue
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dateClick(), to drag and create events
import itLocale from "@fullcalendar/core/locales/it";

import { storeToRefs } from "pinia";
const storeBlocks = useBlocksStore();
const { blockedDatesListFullCalendar, blockedDaysOfWeekList } = storeToRefs(storeBlocks);

const blockedDates = computed(() => blockedDatesListFullCalendar.value.map((item) => ({ ...item, display: "background" })));
const hiddenDaysOfWeek = computed(() => blockedDaysOfWeekList.value.map((item) => (item.dayOfWeek === 7 ? 0 : item.dayOfWeek)));

const daysClosed = computed(() => {
  const isActive = blockedDaysOfWeekList.value.length > 0;
  const isMultipleDays = blockedDaysOfWeekList.value.length > 1;
  const mainSentence = isIT.value
    ? `${isMultipleDays ? "Giorni" : "Giorno"} di chiusura: `
    : `Closed Day${isMultipleDays ? "s" : ""}:`;
  const listOfDays = blockedDaysOfWeekList.value.map((item) => useTranslateDayOfWeek(item.dayOfWeek!)).join(", ");
  return { isActive, mainSentence, listOfDays };
});

const handleDateClick = (dateClickInfo: any) => {
  // Get the date as a string without the time
  const selectedDate = dateClickInfo.date;
  const selectedDateFixed = new Date(dateClickInfo.dateStr);

  const currentDate = new Date(); // Get the current date and time
  currentDate.setHours(0, 0, 0, 0); // Set the time component to midnight for comparison

  // Check if the selectedDate is inside the blockedDates array
  const isDateBlocked = blockedDates.value.some((blockedDate) => {
    // @ts-ignore
    const blockStartDate = new Date(blockedDate.dateStart);
    // @ts-ignore
    const blockEndDate = new Date(blockedDate.dateEnd);
    return selectedDateFixed >= blockStartDate && selectedDateFixed < blockEndDate;
  });

  //  if the selected date is before today's date or is inside blockedDates exit the function
  if (selectedDate < currentDate || isDateBlocked) return;

  dateClickInfo.dayEl.style.backgroundColor = "rgb(0 143 220 / 30%)";

  let dayOfWeek = selectedDate.getDay();
  // adjust sunday, because it's 0 but 7 is app=s sunday
  dayOfWeek === 0 ? (dayOfWeek = 7) : (dayOfWeek = dayOfWeek);

  emit("setReservationDate", selectedDate);
};

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  locale: isIT.value ? itLocale : "",
  headerToolbar: { left: "prev", center: "title", right: "next" },
  initialView: "dayGridMonth",
  editable: false,
  selectable: false,
  dayMaxEvents: true,
  contentHeight: 320,
  progressiveEventRendering: true,
  events: blockedDates,
  hiddenDays: hiddenDaysOfWeek,
  dateClick: handleDateClick,
});
</script>

<template>
  <div class="px-4 py-6 md_px-10">
    <FullCalendar class="calendar-client" :options="calendarOptions" />
    <p
      v-show="daysClosed.isActive"
      class="w-full whitespace-nowrap bg-slate-50 py-1 text-center text-xs tracking-wide text-grey-100"
    >
      {{ daysClosed.mainSentence }} {{ daysClosed.listOfDays }}
    </p>
  </div>
</template>
