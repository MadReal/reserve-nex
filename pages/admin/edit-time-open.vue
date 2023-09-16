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
    <AdminPageTitle title="Gestione Orari" />

    <AdminContainerGrid2ColsBorder>
      <div class="lg_mb-6">
        <p class="mb-4 mt-1">Pranzo</p>
        <AdminAddDeleteWorkTime
          :workTimes="lunchWorkTimesList"
          :isLunch="true"
          @addNewTime="storeWorkTimes.addNewWorkTime"
          @removeTime="storeWorkTimes.removeWorkTime"
        />
      </div>

      <AdminContainerDivider />

      <div class="lg_mb-6">
        <p class="mb-4 mt-1">Cena</p>
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
