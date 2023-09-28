<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";
// load data async without onMounted, before comp creation
// https://vueschool.io/lessons/synchronous-and-asynchronous-actions-in-pinia
// ==============================================
// Store
import { storeToRefs } from "pinia";
const storeRestaurants = useRestaurantsStore();
const { restaurantsList, activeRestaurant } = storeToRefs(storeRestaurants);
// composables
const { loadAdminInitData } = useLoadAllData();
const { switchActiveRestaurant } = useSwitchActiveRestaurant();
const { openModal } = useOpenModal();
// Component's logic
const isDropdownOpen = ref(false);
const toggleDropdown = () => (isDropdownOpen.value = !isDropdownOpen.value);
const closeDropdown = () => (isDropdownOpen.value = false);

function switchActiveRestaurantMethod(restaurantId: Restaurant["id"]) {
  // if different restaurant execute the function
  if (restaurantId !== activeRestaurant.value.id) switchActiveRestaurant(restaurantId);
  // otherwise simply close the dropdown
  toggleDropdown();
}

function openModalMethod(modalType: ModalType, restaurantId?: Restaurant["id"]) {
  openModal("restaurant", restaurantId);
  closeDropdown();
}

// Load all API DATA
loadAdminInitData();
</script>

<template>
  <div class="hidden bg-[#F1F2F7] md_block md_min-h-screen md_basis-60">
    <div class="relative" v-on-click-outside="closeDropdown">
      <div class="flex h-16 cursor-pointer items-center border-b border-grey-100 px-4 py-4" @click="toggleDropdown">
        <div class="mr-1.5">
          <div class="h-8 w-8 rounded-full bg-red-300"></div>
        </div>
        <p class="basis-3/5 text-sm">{{ activeRestaurant?.name }}</p>
        <SVGIcon class="ml-auto text-grey-200 hover_text-grey-300" svg="arrow-down" :size="20"></SVGIcon>
      </div>

      <div
        class="absolute left-2 right-2 top-14 z-30 overflow-y-scroll rounded-lg bg-white text-xs shadow-[0_2px_15px_-2px_rgba(0,0,0,0.1)]"
        v-show="isDropdownOpen"
      >
        <p class="border-b bg-slate-50 px-4 py-3 text-xs tracking-widest text-grey-200">RISTORANTI</p>
        <div class="mx-4 mb-5 mt-2">
          <div class="flex items-center justify-between py-3 pl-px" v-for="restaurant in restaurantsList" :key="restaurant.id">
            <p class="cursor-pointer hover_underline" @click="switchActiveRestaurantMethod(restaurant.id)">
              {{ restaurant.name }}
            </p>
            <SVGIcon
              class="cursor-pointer text-grey-200 hover_text-grey-300"
              svg="edit"
              :size="15"
              @click="openModalMethod('restaurant', restaurant.id)"
            ></SVGIcon>
          </div>

          <div
            class="mt-2 flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-primary-100 px-3 py-2 hover_bg-slate-50"
            @click="openModalMethod('restaurant')"
          >
            <p class="leading-normal text-primary-100">Aggiungi ristorante</p>
            <SVGIcon class="text-primary-100" svg="plus" :size="15"></SVGIcon>
          </div>
        </div>
      </div>
    </div>

    <AdminMenu />
  </div>
</template>
