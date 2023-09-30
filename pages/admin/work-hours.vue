<script setup lang="ts">
definePageMeta({ middleware: ["auth", "empty-restaurants-list"], layout: "admin-default" });
useHead({ title: "Gestione Orari" });

import { storeToRefs } from "pinia";
import { useWorkTimesStore } from "~/stores/WorkTimes";

const storeWorkTimes = useWorkTimesStore();
const { lunchWorkTimesList, dinnerWorkTimesList } = storeToRefs(storeWorkTimes);
</script>

<template>
  <div class="page__content">
    <AdminPageTitle :title="$t('admin.work_hours.page_name')" :subtitle="$t('admin.work_hours.page_subtitle')" />

    <AdminContainerGrid2ColsBorder>
      <div class="md_mb-6">
        <p class="mb-4 mt-1 capitalize">{{ $t("lunch") }}</p>
        <AdminAddDeleteWorkTime
          :workTimes="lunchWorkTimesList"
          :isLunch="true"
          @addNewTime="storeWorkTimes.addNewWorkTime"
          @removeTime="storeWorkTimes.removeWorkTime"
        />
      </div>

      <AdminContainerDivider />

      <div class="md_mb-6">
        <p class="mb-4 mt-1 capitalize">{{ $t("dinner") }}</p>
        <AdminAddDeleteWorkTime
          :workTimes="dinnerWorkTimesList"
          :isLunch="false"
          @addNewTime="storeWorkTimes.addNewWorkTime"
          @removeTime="storeWorkTimes.removeWorkTime"
        />
      </div>
    </AdminContainerGrid2ColsBorder>
  </div>
</template>
