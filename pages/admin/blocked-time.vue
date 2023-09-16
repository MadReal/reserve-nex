<script setup lang="ts">
definePageMeta({ middleware: ["auth", "empty-restaurants-list"], layout: "admin-default" });
useHead({ title: "Blocco Orari" });

import { storeToRefs } from "pinia";
import { useBlocksStore } from "~/stores/Blocks";
import { useWorkTimesStore } from "~/stores/WorkTimes";

const storeBlocks = useBlocksStore();
const storeWorkTimes = useWorkTimesStore();

const { blockedTimeRangeOnDateList, blockedTimeRangeOnDayOfWeekList } = storeToRefs(storeBlocks);
const { workTimesListsMerged } = storeToRefs(storeWorkTimes);

const noData = computed(() => !workTimesListsMerged.value.length);

const canAddBlocksOnTimeRangeOnDayOfWeek = computed(() => {
  const daysOfWeek = [1, 2, 3, 4, 5, 6, 7];
  const usedDaysOfWeek = blockedTimeRangeOnDayOfWeekList.value.map((item) => item.dayOfWeek);
  const allDaysUsed = daysOfWeek.every((day) => usedDaysOfWeek.includes(day));
  return !allDaysUsed;
});

// API CALLS
const addBlockedTimeRangeOnDate = () =>
  storeBlocks.addBlockedTimeRangeOnDate(
    workTimesListsMerged.value[0].time,
    workTimesListsMerged.value[workTimesListsMerged.value.length - 1].time,
  );
const addBlockedTimeRangeOnDayOfWeek = () =>
  storeBlocks.addBlockedTimeRangeOnDayOfWeek(
    workTimesListsMerged.value[0].time,
    workTimesListsMerged.value[workTimesListsMerged.value.length - 1].time,
  );
storeBlocks.fetchBlockedTimeRangeOnDate();
storeBlocks.fetchBlockedTimeRangeOnDayOfWeek();
</script>

<template>
  <div class="page__content">
    <AdminPageTitle title="Blocco Orari" />
    <AdminNoData
      v-if="noData"
      text="Aggiungi orari di apertura prima di poter creare blocchi orari."
      buttonText="Aggiungi Orari"
      linkPath="edit-time-open"
    />

    <template v-else>
      <div class="grid border-b md_grid-cols-[1fr_1px_2fr] md_gap-6">
        <AdminSectionTitle
          title="Giorno Settimanale"
          subtitle="Restrizione delle prenotazioni per determinate fasce orarie nel giorno selezionato, settimanalmente."
        />

        <div class="hidden md_block md_h-full md_border-r"></div>

        <div class="mb-6 md_mt-1">
          <AdminTimeRangeOnDayOfWeek
            v-for="item in blockedTimeRangeOnDayOfWeekList"
            :key="item.id"
            :blockTimeTimeRangeOnDayOfWeek="item"
          />
          <AdminButtonAdd
            v-if="canAddBlocksOnTimeRangeOnDayOfWeek"
            text="Aggiungi Blocco"
            @click="addBlockedTimeRangeOnDayOfWeek()"
          />
        </div>
      </div>

      <div class="grid md_grid-cols-[1fr_1px_2fr] md_gap-6">
        <AdminSectionTitle
          title="Giorno Specifico"
          subtitle="Gestisci la restrizione delle prenotazioni per determinate fasce orarie in una data specifica."
          marginTop="mt-7"
        />

        <div class="hidden md_block md_h-full md_border-r"></div>

        <div class="my-6">
          <AdminTimeRangeOnDate v-for="item in blockedTimeRangeOnDateList" :key="item.id" :blockTimePeriod="item" />
          <AdminButtonAdd text="Aggiungi Blocco" @click="addBlockedTimeRangeOnDate()" />
        </div>
      </div>
    </template>
  </div>
</template>
