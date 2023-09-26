<script setup lang="ts">
import { storeToRefs } from "pinia";
const storeRestaurants = useRestaurantsStore();
const { restaurantsListFilterIsLive } = storeToRefs(storeRestaurants);

storeRestaurants.fetchRestaurants();
</script>

<template>
  <div class="page relative z-0 -mt-16">
    <section>
      <div class="mx-auto mt-6 max-w-screen-xl px-4 py-40 md_mt-24">
        <h1 class="mb-12 text-center text-4xl font-semibold text-black md_text-5xl">Seleziona il ristornate</h1>

        <div class="grid gap-4 md_grid-cols-2">
          <ClientBoxRestaurant v-for="restaurant in restaurantsListFilterIsLive" :key="restaurant.id" :restaurant="restaurant" />
        </div>
      </div>
    </section>
  </div>
</template>
