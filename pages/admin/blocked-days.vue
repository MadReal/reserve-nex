<script setup lang="ts">
import { storeToRefs } from "pinia";
import _default_swearWords from "@/data/swear-words.json";
const i18n = useI18n();

definePageMeta({
  middleware: ["auth", "empty-restaurants-list"],
  layout: "admin-default",
});
useHead({ title: i18n.t("admin.blocked_days.page_name") });

const isIT = computed(() => i18n.locale.value === "it");

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
  const sentence = isIT.value ? "Sicuro di voler eliminare l'evento" : "Are you sure you want to delete the event";
  if (confirm(`${sentence} '${clickInfo.event.title}'?`)) {
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

  const sentence = isIT.value ? "Inserisci un titolo per questo evento" : "Add a title for this event";
  let title = prompt(sentence, isIT.value ? "Chiuso" : "Closed");
  // Define an array of swear words to check against

  if (title) {
    // Convert the user's input to lowercase to make the check case-insensitive
    const lowercasedTitle = title.toLowerCase();
    // Check if the user's input contains any swear words
    if (_default_swearWords.some((word) => lowercasedTitle.includes(word))) {
      // Display an alert message if a swear word is found
      const sentence = isIT.value
        ? "Per favore, evita di utilizzare linguaggio offensivo."
        : "Please refrain from using offensive language.";
      return alert(sentence);
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
  locale: isIT.value ? itLocale : "",
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
