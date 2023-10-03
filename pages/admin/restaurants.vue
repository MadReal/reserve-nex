<script setup lang="ts">
const i18n = useI18n();

definePageMeta({ middleware: ["auth"], layout: "admin-no-sidebar" });
useHead({ title: i18n.t("admin.restaurants.page_name") });

import { storeToRefs } from "pinia";

const storeRestaurants = useRestaurantsStore();
const { restaurantsList } = storeToRefs(storeRestaurants);
const { switchActiveRestaurant } = useSwitchActiveRestaurant();
const { openModal } = useOpenModal();

storeRestaurants.fetchRestaurants();
</script>

<template>
  <div class="page__content">
    <AdminPageTitle :title="$t('admin.restaurants.page_name')" />

    <div class="grid grid-cols-1 gap-5 text-xl md_grid-cols-4">
      <div
        class="relative flex min-h-[8rem] cursor-pointer items-center justify-center rounded border border-gray-200 hover_bg-slate-50"
        v-for="item in restaurantsList"
        :key="item.id"
      >
        <div class="w-full py-4 text-center md_px-4 md_py-10" @click="switchActiveRestaurant(item.id)">
          <p @click="switchActiveRestaurant(item.id)">{{ item.name }}</p>
          <p class="text-sm text-grey-200" @click="switchActiveRestaurant(item.id)">{{ item.address }}, {{ item.city }}</p>
        </div>

        <div class="absolute bottom-3 right-3 flex items-center">
          <SVGIcon
            class="cursor-pointer text-grey-200 hover_text-grey-300"
            svg="edit"
            :size="20"
            @click="openModal('restaurant', item.id)"
          />
        </div>
      </div>

      <div
        class="flex min-h-[8rem] cursor-pointer items-center justify-center rounded border border-dashed border-primary-100 hover_bg-slate-50"
      >
        <div class="w-full p-4 text-center md_p-10" @click="openModal('restaurant')">
          <SVGIcon class="mx-auto mb-2 text-primary-100" svg="plus" :size="28" />
          <p class="text-primary-100">{{ $t("admin.restaurants.btn_add_restaurant") }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
