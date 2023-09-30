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
const toggleDropdownCalendar = () => (isDropdownCalendarOpen.value = !isDropdownCalendarOpen.value);
const closeDropdownCalendar = () => (isDropdownCalendarOpen.value = false);
</script>

<template>
  <div
    class="relative flex cursor-pointer items-center"
    :class="{ 'text-grey-100': !selectedDate, 'rounded-md bg-slate-50 pl-1 text-grey-200': selectedDate }"
    v-on-click-outside="closeDropdownCalendar"
  >
    <p class="inline-flex items-center px-1 py-1 text-sm leading-normal hover_text-grey-300" @click="toggleDropdownCalendar()">
      {{ selectedDate ? useDateFormatting(selectedDate) : $t("admin.reservations.select_date") }}
      <SVGIcon v-show="!selectedDate" svg="arrow-down" :size="14" />
    </p>
    <div class="p-1 hover_text-grey-300" @click="removeDate()" v-if="selectedDate">
      <SVGIcon svg="close" />
    </div>

    <div v-show="isDropdownCalendarOpen" class="absolute -left-3 top-8 z-10 h-fit rounded-lg bg-white shadow-lg md_right-0">
      <VueDatePicker
        v-model="selectedDate"
        locale="it"
        :month-change-on-scroll="false"
        :enable-time-picker="false"
        :clearable="true"
        inline
        auto-apply
        @update:model-value="setNewDate()"
      />
    </div>
  </div>
</template>
