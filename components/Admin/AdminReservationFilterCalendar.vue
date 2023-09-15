<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { vOnClickOutside } from "@vueuse/components";

const emit = defineEmits(["setDateFilterReservation"]);

const selectedDate = ref(null);

const setNewDate = () => {
  emit("setDateFilterReservation", selectedDate.value);
  closeDropdownCalendar();
};
const removeDate = () => {
  emit("setDateFilterReservation", null);
  selectedDate.value = null;
};

// Data Picker dropdown
const isDropdownCalendarOpen = ref(false);
const toggleDropdownCalendar = () =>
  (isDropdownCalendarOpen.value = !isDropdownCalendarOpen.value);
const closeDropdownCalendar = () => (isDropdownCalendarOpen.value = false);
</script>

<template>
  <div
    class="relative flex cursor-pointer items-center"
    v-on-click-outside="closeDropdownCalendar"
  >
    <p
      class="px-2 py-1 text-sm leading-normal text-grey-100"
      :class="{
        'rounded-md bg-slate-50 text-grey-300': selectedDate,
      }"
      @click="toggleDropdownCalendar()"
    >
      {{ selectedDate ? useDateFormatting(selectedDate) : "Seleziona data" }}
    </p>
    <SVGIcon
      svg="close"
      v-if="selectedDate"
      @click="removeDate()"
      class="ml-1 text-grey-200 hover_text-grey-300"
    ></SVGIcon>

    <div
      v-show="isDropdownCalendarOpen"
      class="absolute right-0 top-8 z-10 h-fit rounded-lg bg-white shadow-lg md_-left-3"
    >
      <VueDatePicker
        v-model="selectedDate"
        locale="it"
        :month-change-on-scroll="false"
        :enable-time-picker="false"
        :clearable="true"
        inline="inline"
        auto-apply="auto-apply"
        :state="true"
        @update:model-value="setNewDate()"
      ></VueDatePicker>
    </div>
  </div>
</template>
