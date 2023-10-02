<script setup lang="ts">
import { storeToRefs } from "pinia";
const storeRestaurants = useRestaurantsStore();
const { restaurantsListFilterIsLive } = storeToRefs(storeRestaurants);

storeRestaurants.fetchRestaurants();
</script>

<template>
  <div class="page relative z-0 -mt-16">
    <section>
      <div class="mx-auto mt-6 max-w-screen-xl px-4 py-20 md_mt-24 md_py-32">
        <h1 class="mb-12 text-center text-3xl font-semibold text-black md_text-4xl">
          {{ $t("client_reservation.select_restaurant") }}
        </h1>

        <div class="grid gap-4 md_grid-cols-2">
          <ClientBoxRestaurant
            v-for="(restaurant, index) in restaurantsListFilterIsLive"
            :key="restaurant.id"
            :restaurant="restaurant"
            :index="index"
          />
        </div>
      </div>
    </section>
  </div>
</template>
