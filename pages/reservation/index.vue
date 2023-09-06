<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRestaurantsStore } from '@/stores/Restaurants';
const storeRestaurants = useRestaurantsStore();
const { restaurantsList } = storeToRefs(storeRestaurants)

storeRestaurants.fetchRestaurants();

</script>


<template lang="pug">
.page.relative.-mt-16.z-0
    section
        .max-w-screen-xl.px-4.py-48.mx-auto

            h1.mb-6.text-3xl.text-center.font-semibold.text-grey-100 Seleziona il ristornate

            .grid.grid-cols-2.gap-4
                NuxtLink.relative.border.p-8.overflow-hidden.flex.items-center.justify-center.bg-black.cursor-pointer.group(
                    class="min-h-[24rem]", 
                    v-for="(restaurant, index) in restaurantsList"
                    :to="`/reservation/${restaurant.id}`")
                    NuxtImg.absolute.inset-0.z-0.opacity-60.transition-transform.transition-opacity.duration-500.group-hover_opacity-30.group-hover_scale-105(:src="`/images/plate${index + 1}.webp`")
                    .relative.z-10.text-center
                        p.text-2xl.text-white.font-bold.tracking-wider {{ restaurant.name }}
                        p.text-md.text-gray-300 {{ restaurant.address }}, {{ restaurant.city }} {{ restaurant.zipCode }}
</template>