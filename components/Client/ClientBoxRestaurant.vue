<script setup lang="ts">
interface Props {
  restaurant: Restaurant;
}
const props = defineProps<Props>();
</script>

<template>
  <NuxtLink
    class="group relative flex min-h-[16rem] cursor-pointer items-center justify-center overflow-hidden border bg-black p-8 md_min-h-[24rem]"
    :to="{ path: `/reservation/${restaurant.id}`, query: { step: 1 } }"
  >
    <NuxtImg
      class="absolute inset-0 z-0 h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover_scale-105 group-hover_opacity-30"
      :src="`/images/plate1.webp`"
    />
    <div class="relative z-10 text-center">
      <p class="text-2xl font-bold tracking-wider text-white">{{ restaurant.name }}</p>
      <p class="text-base text-gray-300">{{ restaurant.address }}, {{ restaurant.city }} {{ restaurant.zipCode }}</p>
    </div>
  </NuxtLink>
</template>
