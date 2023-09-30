<script setup lang="ts">
import _default_workTimesAvailable from "@/data/work-times-available.json";
import { vOnClickOutside } from "@vueuse/components";

interface SelectWorkHourProps {
  workTimes: WorkTime[];
  isLunch: boolean;
}
const props = defineProps<SelectWorkHourProps>();
const emit = defineEmits(["addNewTime", "removeTime"]);

const workTimesAvailable = _default_workTimesAvailable[props.isLunch ? "lunch" : "dinner"];
const isHoursStillAvailableToFill = computed(() => props.workTimes.length !== workTimesAvailable.length);

let isSelectVisible = ref(false);
const toggleSelect = () => (isSelectVisible.value = true);
let isDropdownOpen = ref(true);
const toggleDropdown = () => (isDropdownOpen.value = !isDropdownOpen.value);
const closeDropdown = () => (isDropdownOpen.value = false);

const addNewTime = (newTime: WorkTime["time"]) => {
  if (isTimeUsed(newTime)) return;
  emit("addNewTime", newTime);
  isSelectVisible.value = false;
  isDropdownOpen.value = false;
};
const removeTime = (timeId: number) => emit("removeTime", timeId);
const isTimeUsed = (time: WorkTime["time"]): boolean => props.workTimes.some((workTime) => workTime.time === time);
</script>

<template>
  <div>
    <div class="mb-2 flex items-center justify-between rounded-lg border px-3 py-2" v-for="time in workTimes" :key="time.id">
      <p class="leading-normal text-grey-300">{{ time.time }}</p>
      <SVGIcon class="cursor-pointer text-grey-300 hover_text-error-200" svg="trash" :size="15" @click="removeTime(time.id)" />
    </div>

    <AdminButtonAdd
      v-if="!isSelectVisible && isHoursStillAvailableToFill"
      :text="$t('admin.work_hours.btn_add_work_hour')"
      @click="toggleSelect()"
    />
    <div
      class="relative mb-2 flex cursor-pointer items-center justify-between rounded-lg border border-primary-100 px-3 py-2 hover_bg-slate-50"
      v-if="isSelectVisible && isHoursStillAvailableToFill"
      @click="toggleDropdown()"
      v-on-click-outside="closeDropdown"
    >
      <p class="capitalize leading-normal text-primary-100">{{ $t("admin.work_hours.btn_select_work_hour") }}</p>
      <SVGIcon class="text-primary-100" svg="arrow-down" :size="15" />
      <div
        class="absolute inset-x-0 top-12 z-10 max-h-40 overflow-y-scroll rounded-lg bg-white shadow-lg"
        v-show="isDropdownOpen"
      >
        <p
          class="px-3 py-2"
          v-for="time in workTimesAvailable"
          :key="time"
          @click="addNewTime(time)"
          :class="{
            'cursor-not-allowed bg-gray-50\ttext-gray-200 line-through': isTimeUsed(time),
            'cursor-pointer text-grey-300 hover_bg-gray-100': !isTimeUsed(time),
          }"
        >
          {{ time }}
        </p>
      </div>
    </div>
  </div>
</template>
