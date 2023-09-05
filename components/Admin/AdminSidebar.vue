<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'
// load data async without onMounted, before comp creation
// https://vueschool.io/lessons/synchronous-and-asynchronous-actions-in-pinia
// ==============================================
// Store
import { storeToRefs } from 'pinia'
import { useRestaurantsStore } from '~/stores/Restaurants'
const storeRestaurants = useRestaurantsStore();
const { restaurantsList } = storeToRefs(storeRestaurants)
const { activeRestaurant } = storeToRefs(storeRestaurants)
// composables
const { loadAdminInitData } = useLoadAllData()
const { switchActiveRestaurant } = useSwitchActiveRestaurant()
const { openModal } = useOpenModal();
// Component's logic
const isDropdownOpen = ref(false);
const toggleDropdown = () => isDropdownOpen.value = !isDropdownOpen.value
const closeDropdown = () => { if (isDropdownOpen.value) toggleDropdown() }
// // Load all API DATA
loadAdminInitData()
</script>


<template lang="pug">
.hidden.lg_block.lg_min-h-screen.lg_basis-60(class="bg-[#F1F2F7]")
    //- SIDEBAR MENU - Restaurant Profile
    .relative(v-on-click-outside="closeDropdown")
        .flex.items-center.h-16.border-b.border-grey-100.py-4.px-5.cursor-pointer(@click="toggleDropdown")
            div(class="basis-1/5")
                .w-8.h-8.bg-red-300.rounded-full
            p.text-sm.break-all(class="basis-3/5") {{ activeRestaurant?.name }}
            SVGIcon.text-grey-200.hover_text-grey-300(svg="arrow-down", :size="20")

        //- Dropdown
        .absolute.left-2.right-2.top-14.bg-white.rounded-lg.shadow-lg.overflow-y-scroll.z-10.text-xs(v-show="isDropdownOpen")
            p.mb-2.py-3.px-5.border-b.text-xs.text-grey-200.tracking-widest RISTORANTI
            .mx-3.mt-3.mb-5
                .p-3.flex.items-center.justify-between(v-for="restaurant in restaurantsList" :key="restaurant.id")
                    p.cursor-pointer.hover_underline(@click="switchActiveRestaurant(restaurant.id); toggleDropdown()") {{ restaurant.name }}
                    SVGIcon.text-grey-200.cursor-pointer.hover_text-grey-300(svg="edit", :size="15" 
                        @click="openModal('restaurant', restaurant.id); closeDropdown()")
                .mt-2.p-3.flex.items-center.justify-between.border.border-dashed.border-primary-100.rounded-lg.cursor-pointer.hover_bg-slate-50(
                    @click="openModal('restaurant'); closeDropdown()")
                    p.leading-normal.text-primary-100 Aggiungi ristorante
                    SVGIcon.text-primary-100(svg="plus", :size="15")

    //- SIDEBAR MENU - Items
    AdminMenu
</template>