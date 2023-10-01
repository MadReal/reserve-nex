<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "empty-restaurants-list"],
  layout: "admin-default",
});
useHead({ title: "Blocco Giorni" });

const { locale } = useI18n();
const isIT = locale.value === "it";

import { storeToRefs } from "pinia";
import { useBlocksStore } from "~/stores/Blocks";
const storeBlocks = useBlocksStore();

const { blockedDaysOfWeekList, blockedDatesListFullCalendar } = storeToRefs(storeBlocks);
// used to dynamically set class
const isblockedDaysOfWeekListShort = computed(() => blockedDaysOfWeekList.value.length < 1);
// if all days are added
const isBlockedDaysOfWeekListFull = computed(() => blockedDaysOfWeekList.value.length > 6);

//************
// CALENDAR
//************
// https://github.com/fullcalendar/fullcalendar-vue
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dateClick(), to drag and create events
import itLocale from "@fullcalendar/core/locales/it";

const handleEventClick = async (clickInfo: any) => {
  const blockId: Block["id"] = parseInt(clickInfo.event.id);
  if (confirm(`Sicuro di voler eliminare l'evento '${clickInfo.event.title}'?`)) {
    await storeBlocks.removeBlock(blockId);
    // clickInfo.event.remove();
  }
};
const handleDateSelect = async (selectInfo: any) => {
  // ********* if user clicks on "past" dates, exit function *********
  const selectedDate = selectInfo.start;
  const currentDate = new Date(); // Get the current date and time
  currentDate.setUTCHours(0, 0, 0, 0); // Set the time component to midnight for comparison
  if (selectedDate < currentDate) return;
  // ****************************** END ******************************

  let title = prompt("Inserisci un titolo per questo evento", "Chiuso");
  // Define an array of swear words to check against
  const swearWords = [
    "fanculo",
    "troia",
    "puttana",
    "dio cane",
    "diocane",
    "porco dio",
    "merda",
    "fuck",
    "shit",
    "whore",
    "bitch",
    "cunt",
  ];

  if (title) {
    // Convert the user's input to lowercase to make the check case-insensitive
    const lowercasedTitle = title.toLowerCase();
    // Check if the user's input contains any swear words
    if (swearWords.some((word) => lowercasedTitle.includes(word))) {
      // Display an alert message if a swear word is found
      return alert("Per favore, evita di utilizzare linguaggio offensivo.");
    }

    await storeBlocks.addBlockedDate(selectInfo.startStr, selectInfo.endStr, title);
    // let calendarApi = selectInfo.view.calendar;
    // calendarApi.unselect(); // clear date selection
  }
};

const handleDragAndResize = (info: any) => {
  const blockedDate = info.event;
  storeBlocks.updateBlockedDate(parseInt(blockedDate.id), blockedDate.start, blockedDate.end);
};

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  locale: isIT ? itLocale : "",
  headerToolbar: { left: "prev", center: "title", right: "next" },
  initialView: "dayGridMonth",
  editable: true,
  selectable: true,
  dayMaxEvents: true,
  contentHeight: 480,
  events: blockedDatesListFullCalendar,
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventDrop: handleDragAndResize,
  eventResize: handleDragAndResize,
});
// API CALLS
storeBlocks.fetchBlockedDaysOfWeek();
storeBlocks.fetchBlockedDates();
</script>

<template>
  <div class="page__content">
    <AdminPageTitle :title="$t('admin.blocked_days.page_name')" />

    <div class="grid border-b md_gap-6" :class="['md_grid-cols-[2fr_1px_1fr]', { 'items-center': isblockedDaysOfWeekListShort }]">
      <AdminSectionTitle :title="$t('admin.blocked_days.title1')" :subtitle="$t('admin.blocked_days.subtitle1')" />

      <!-- divider -->
      <div class="hidden md_block md_h-full md_border-r"></div>

      <div class="mb-8 md_mb-6 md_mt-1">
        <!-- list of already added ones -->
        <AdminSelectDayOfWeek
          v-for="day in blockedDaysOfWeekList"
          :key="day.id"
          :blockedDaysOfWeekList="blockedDaysOfWeekList"
          :blockedDay="day"
          @addOrUpdateDay="storeBlocks.addOrUpdateBlockedDayOfWeek"
          @removeDay="storeBlocks.removeBlock"
          :isUpdate="true"
          :showTrash="!isblockedDaysOfWeekListShort"
        />
        <!-- empty, where you can select new one -->
        <AdminSelectDayOfWeek
          v-if="!isBlockedDaysOfWeekListFull"
          :blockedDaysOfWeekList="blockedDaysOfWeekList"
          @addOrUpdateDay="storeBlocks.addOrUpdateBlockedDayOfWeek"
          :isUpdate="false"
          :showTrash="false"
        />
      </div>
    </div>

    <div>
      <AdminSectionTitle
        :title="$t('admin.blocked_days.title2')"
        :subtitle="$t('admin.blocked_days.subtitle2')"
        marginTop="mt-8"
        subtitleSmallerWidth
      />
      <FullCalendar class="calendar-admin mt-10 md_mt-8" :options="calendarOptions" />
    </div>
  </div>
</template>
