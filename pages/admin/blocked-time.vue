<script setup lang="ts">
definePageMeta({ middleware: ["auth", "empty-restaurants-list"], layout: "admin-default" });
useHead({ title: "Blocco Orari" });

import { storeToRefs } from "pinia";
import { useBlocksStore } from "~/stores/Blocks";
import { useWorkTimesStore } from "~/stores/WorkTimes";

const storeBlocks = useBlocksStore();
const storeWorkTimes = useWorkTimesStore();

const { blockedTimeRangeOnDateList, blockedTimeRangeOnDayOfWeekList } = storeToRefs(storeBlocks);
const { workTimesListsSorted } = storeToRefs(storeWorkTimes);

const noData = computed(() => !workTimesListsSorted.value.length);

const canAddBlocksOnTimeRangeOnDayOfWeek = computed(() => {
  const daysOfWeek = [1, 2, 3, 4, 5, 6, 7];
  const usedDaysOfWeek = blockedTimeRangeOnDayOfWeekList.value.map((item) => item.dayOfWeek);
  const allDaysUsed = daysOfWeek.every((day) => usedDaysOfWeek.includes(day));
  return !allDaysUsed;
});

// API CALLS
const addBlockedTimeRangeOnDate = () =>
  storeBlocks.addBlockedTimeRangeOnDate(
    workTimesListsSorted.value[0].time,
    workTimesListsSorted.value[workTimesListsSorted.value.length - 1].time,
  );
const addBlockedTimeRangeOnDayOfWeek = () =>
  storeBlocks.addBlockedTimeRangeOnDayOfWeek(
    workTimesListsSorted.value[0].time,
    workTimesListsSorted.value[workTimesListsSorted.value.length - 1].time,
  );
storeBlocks.fetchBlockedTimeRangeOnDate();
storeBlocks.fetchBlockedTimeRangeOnDayOfWeek();
</script>

<template>
  <div class="page__content">
    <AdminPageTitle :title="$t('admin.blocked_times.page_name')" />
    <AdminNoData
      v-if="noData"
      text="Aggiungi orari di apertura prima di poter creare blocchi orari."
      buttonText="Aggiungi Orari"
      linkPath="work-hours"
    />

    <template v-else>
      <div class="grid border-b md_grid-cols-[1fr_1px_2fr] md_gap-6">
        <AdminSectionTitle :title="$t('admin.blocked_times.title1')" :subtitle="$t('admin.blocked_times.subtitle1')" />

        <div class="hidden md_block md_h-full md_border-r"></div>

        <div class="mb-6 md_mt-1">
          <AdminTimeRangeOnDayOfWeek
            v-for="item in blockedTimeRangeOnDayOfWeekList"
            :key="item.id"
            :blockTimeTimeRangeOnDayOfWeek="item"
          />
          <AdminButtonAdd
            v-if="canAddBlocksOnTimeRangeOnDayOfWeek"
            :text="$t('admin.blocked_times.btn_add_block')"
            @click="addBlockedTimeRangeOnDayOfWeek()"
          />
        </div>
      </div>

      <div class="grid md_grid-cols-[1fr_1px_2fr] md_gap-6">
        <AdminSectionTitle
          :title="$t('admin.blocked_times.title2')"
          :subtitle="$t('admin.blocked_times.subtitle2')"
          marginTop="mt-7"
        />

        <div class="hidden md_block md_h-full md_border-r"></div>

        <div class="my-6">
          <AdminTimeRangeOnDate v-for="item in blockedTimeRangeOnDateList" :key="item.id" :blockTimePeriod="item" />
          <AdminButtonAdd :text="$t('admin.blocked_times.btn_add_block')" @click="addBlockedTimeRangeOnDate()" />
        </div>
      </div>
    </template>
  </div>
</template>
