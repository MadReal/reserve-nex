<script setup lang="ts">
definePageMeta({ middleware: ['auth'], layout: 'admin-no-sidebar' })
useHead({ title: 'Ristoranti', })

import { storeToRefs } from 'pinia'
import { useRestaurantsStore } from '@/stores/Restaurants';

const storeRestaurants = useRestaurantsStore();
const { restaurantsList } = storeToRefs(storeRestaurants)
const { switchActiveRestaurant } = useSwitchActiveRestaurant()
const { openModal } = useOpenModal();

storeRestaurants.fetchRestaurants()
</script>


<template lang="pug">
.page__content
    AdminPageTitle(title="Ristoranti")

    .grid.grid-cols-4.gap-5.text-xl
        .flex.items-center.justify-center.border.border-gray-200.rounded.relative.cursor-pointer.hover_bg-slate-50(v-for="item in restaurantsList", :key="item.id")
            .w-full.py-10.px-4.m-6.text-center(@click="switchActiveRestaurant(item.id)")
                p(@click="switchActiveRestaurant(item.id)") {{ item.name }}
                p.text-sm.text-grey-200(@click="switchActiveRestaurant(item.id)") {{ item.address }}, {{ item.city }}
            .absolute.bottom-3.right-3.flex.items-center.gap-1
                SVGIcon.text-grey-200.cursor-pointer.hover_text-grey-300(svg="edit", :size="20" @click="openModal('restaurant', item.id)")

        .flex.items-center.justify-center.border.border-dashed.border-primary-100.rounded.cursor-pointer.hover_bg-slate-50
            div.p-10(@click="openModal('restaurant')")
                SVGIcon.text-primary-100.mx-auto.mb-2(svg="plus", :size="28")
                p.text-center.text-primary-100 Aggiungi Ristorante
</template>