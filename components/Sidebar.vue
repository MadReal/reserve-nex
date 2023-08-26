<script setup lang="ts">
// load data async without onMounted, before comp creation
// https://vueschool.io/lessons/synchronous-and-asynchronous-actions-in-pinia
// ==============================================
import { storeToRefs } from 'pinia'
import { useRestaurantsStore } from '~/store/Restaurants'
import { useWorkTimesStore } from '~/store/WorkTimes'
import { useReservationsStore } from '@/store/Reservations';
import { useBlocksStore } from '~/store/Blocks'
import { useModalsStore } from '~/store/Modals'

// Component's logic
const isDropdownOpen = ref(false);
const toggleDropdown = () => isDropdownOpen.value = !isDropdownOpen.value

// Store
const storeRestaurants = useRestaurantsStore();
const storeWorkTimes = useWorkTimesStore();
const storeReservations = useReservationsStore();
const storeModals = useModalsStore()
const { restaurantsList } = storeToRefs(storeRestaurants)

function openModal(modalType: ModalType, restaurantId: Restaurant['id']) {
    storeModals.openModal(modalType, restaurantId)
}

// Load all API DATA
function loadAllData() {
    storeRestaurants.fetchRestaurants()
    storeWorkTimes.fetchWorkTimes()
    storeReservations.fetchResevations()
}
loadAllData()
</script>


<template lang="pug">
.min-h-screen.basis-60(class="bg-[#F1F2F7]")
    //- SIDEBAR MENU - Restaurant Profile
    div.relative
        .flex.items-center.h-16.border-b.border-grey-100.py-4.px-6.cursor-pointer(@click="toggleDropdown")
            div.mr-1(class="basis-1/5")
                .w-8.h-8.bg-red-300.rounded-full
            p.text-sm.break-words(class="basis-3/5") {{ storeRestaurants?.activeRestaurant?.name }}
            SVGIcon.text-grey-200.hover_text-grey-300(svg="arrow-down", :size="20")
        //- Dropdown
        .absolute.inset-x-0.top-12.max-h-40.bg-white.rounded-lg.shadow-lg.overflow-y-scroll.z-10.p-3.text-xs(v-show="isDropdownOpen")
            .flex.items-center.justify-between.py-2.px-3.mb-1(v-for="restaurant in restaurantsList" :key="restaurant.id")
                p.cursor-pointer.hover_underline(@click="storeRestaurants.switchActiveResturant(restaurant.id)") {{ restaurant.name }}
                SVGIcon.text-grey-200.cursor-pointer.hover_text-grey-300(svg="edit", :size="15" @click="openModal('restaurant', restaurant.id)")
            .flex.items-center.justify-between.border.border-dashed.border-primary-100.rounded-lg.py-2.px-3.cursor-pointer.hover_bg-slate-50(@click="openModal('restaurant')")
                p.leading-normal.text-primary-100 Aggiungi ristorante
                SVGIcon.text-primary-100(svg="plus", :size="15")            

    //- SIDEBAR MENU - Items
    .py-6.px-4
        .mb-8.mt-4
            p.mb-3.px-3.text-xs.tracking-widest.text-grey-200 MENU

            NuxtLink.router-link.flex.items-center.p-4.cursor-pointer.group(to="/admin/reservations" class="")
                SVGIcon.text-grey-100.mr-2.group-hover_text-grey-200(svg="check", :size="20")
                p.text-sm.text-grey-200.tracking-wide Prenotazioni
            NuxtLink.router-link.flex.items-center.p-4.cursor-pointer.group(to="/admin/day-summary")
                SVGIcon.text-grey-100.mr-2.group-hover_text-grey-200(svg="calendar", :size="20")
                p.text-sm.text-grey-200.tracking-wide Riepilogo Giorno
            NuxtLink.router-link.flex.items-center.p-4.cursor-pointer.group(to="/admin/edit-time-open")
                SVGIcon.text-grey-100.mr-2.group-hover_text-grey-200(svg="clock", :size="20")
                p.text-sm.text-grey-200.tracking-wide Gestione Orari

        .my-8
            p.mb-3.px-3.text-xs.tracking-widest.text-grey-200 GESTIONE BLOCCHI

            NuxtLink.router-link.flex.items-center.p-4.cursor-pointer.group(to="/admin/blocked-days")
                SVGIcon.text-grey-100.mr-2.group-hover_text-grey-200(svg="block", :size="20")
                p.text-sm.text-grey-200.tracking-wide Blocco Giorni
            NuxtLink.router-link.flex.items-center.p-4.cursor-pointer.group(to="/admin/blocked-time")
                SVGIcon.text-grey-100.mr-2.group-hover_text-grey-200(svg="block", :size="20")
                p.text-sm.text-grey-200.tracking-wide Blocco Orari
</template>