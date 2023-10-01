<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";
const { locale } = useI18n();
const isIT = computed(() => locale.value === "it");

interface AdminSelectDayOfWeekProps {
  showTrash: boolean;
  isUpdate: boolean; // true: add new day - false: update day
  blockedDaysOfWeekList: Block[];
  blockedDay?: Block;
}
const props = defineProps<AdminSelectDayOfWeekProps>();
const emit = defineEmits(["addOrUpdateDay", "removeDay"]);

const isDropdownOpen = ref(false);
const toggleDropdown = () => (isDropdownOpen.value = !isDropdownOpen.value);
const closeDropdown = () => (isDropdownOpen.value = false);

const dayIsAlreadyInBlockedDaysList = (dayInt: number) => props.blockedDaysOfWeekList.some((e) => e.dayOfWeek === dayInt);
// if there's a blocked day show the day's name || if there are other blockedDaysOfWeek add 'altro', otherwise empty
const buttonText = computed(() => {
  const sentenceIT = `Seleziona ${props.blockedDaysOfWeekList?.length ? "altro" : ""} giorno`;
  const sentenceEN = `Select ${props.blockedDaysOfWeekList?.length ? "another" : ""} day`;
  if (props.blockedDay?.dayOfWeek) return useTranslateDayOfWeek(props.blockedDay.dayOfWeek);
  else return isIT.value ? sentenceIT : sentenceEN;
});
const addOrUpdateDay = (dayInt: number) => {
  if (dayIsAlreadyInBlockedDaysList(dayInt)) return;
  emit("addOrUpdateDay", props.blockedDay?.id, dayInt, props.isUpdate);
};
</script>

<template>
  <div class="relative mb-2 flex items-center justify-between gap-3" v-on-click-outside="closeDropdown">
    <div
      class="flex grow cursor-pointer items-center justify-between rounded-lg border px-3 py-2 hover_bg-slate-50"
      @click="toggleDropdown()"
    >
      <p class="text-sm leading-normal text-grey-200">{{ buttonText }}</p>
      <SVGIcon class="text-primary-100" svg="arrow-down" :size="15" />
      <div
        class="absolute inset-x-0 top-12 z-10 max-h-40 overflow-y-scroll rounded-lg bg-white shadow-lg"
        v-show="isDropdownOpen"
      >
        <p
          class="px-3 py-2 text-sm"
          v-for="dayInt in 7"
          :key="dayInt"
          @click="addOrUpdateDay(dayInt)"
          :class="{
            'cursor-not-allowed bg-gray-50\ttext-gray-200 line-through': dayIsAlreadyInBlockedDaysList(dayInt),
            'cursor-pointer text-grey-300 hover_bg-gray-100': !dayIsAlreadyInBlockedDaysList(dayInt),
          }"
        >
          {{ useTranslateDayOfWeek(dayInt) }}
        </p>
      </div>
    </div>
    <div class="w-4">
      <SVGIcon
        class="cursor-pointer text-grey-200 hover_text-error-200"
        svg="trash"
        :size="15"
        v-if="showTrash"
        @click="$emit('removeDay', blockedDay?.id)"
      />
    </div>
  </div>
</template>
