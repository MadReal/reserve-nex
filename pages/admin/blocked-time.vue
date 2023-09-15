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

        <div class="mb-8 md_mb-6 md_mt-1">
          <AdminBlockedTimeRangeOnDayOfWeek
            v-for="item in blockedTimeRangeOnDayOfWeekList"
            :key="item.id"
            :blockTimeTimeRangeOnDayOfWeek="item"
          />
          <div
            class="mb-2 flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-grey-100 px-3 py-2 hover_bg-slate-50"
            @click="addBlockedTimeRangeOnDayOfWeek()"
          >
            <p class="leading-normal text-grey-200">Aggiungi Blocco</p>
            <SVGIcon class="text-grey-300" svg="plus" :size="15"></SVGIcon>
          </div>
        </div>
      </div>

      <div class="grid md_grid-cols-[1fr_1px_2fr] md_gap-6">
        <AdminSectionTitle
          title="Giorno Specifico"
          subtitle="Gestisci la restrizione delle prenotazioni per determinate fasce orarie in una data specifica."
          marginTop="mt-8"
        />

        <div class="hidden md_block md_h-full md_border-r"></div>

        <div class="mb-8 md_my-6">
          <AdminBlockedTimeRangeOnDate v-for="item in blockedTimeRangeOnDateList" :key="item.id" :blockTimePeriod="item" />
          <div
            class="mb-2 flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-grey-100 px-3 py-2 hover_bg-slate-50"
            @click="addBlockedTimeRangeOnDate()"
          >
            <p class="leading-normal text-grey-200">Aggiungi Blocco</p>
            <SVGIcon class="text-grey-300" svg="plus" :size="15"></SVGIcon>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
