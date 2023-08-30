<script setup lang="ts">
// @ts-ignore
import debounce from 'lodash.debounce';

import { storeToRefs } from 'pinia'
import { useRestaurantsStore } from '~/stores/Restaurants'
import { useReservationsStore } from '~/stores/Reservations'
const storeRestaurants = useRestaurantsStore();
const { restaurantsList } = storeToRefs(storeRestaurants)
const storeReservations = useReservationsStore();
const { reservationsSearchList } = storeToRefs(storeReservations)
// composables
const formatDate = (date: string) => useDateTimeFormatting(date).formattedDate
const { switchActiveRestaurant } = useSwitchActiveRestaurant()
const { openModal } = useOpenModal();
// component's logic
const client = useSupabaseClient()
const user = useSupabaseUser()

interface NavbarProps {
    showSerch?: boolean
}
const props = withDefaults(defineProps<NavbarProps>(), {
    showSerch: true
});

let search = ref('')
let showSearchError = ref(false)

let isMenuOpen = ref(false)
function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value
}

async function logout() {
    const { error } = await client.auth.signOut()
    if (error) throw error
    else return navigateTo("/");
}

// Use the debounce function to create a debounced version of your callback
const delayedSearch = debounce(async (newSearch: string) => {
    showSearchError.value = false
    const data = await storeReservations.fetchReservations(newSearch)
    if (!data || !data.length) { showSearchError.value = true }
}, 1200);
// Watch the search input and call the debounced function
watch(search, (newSearch) => { delayedSearch(newSearch); });
</script>


<template lang="pug">
nav.bg-white.fixed.w-full.h-12.z-20.top-0.left-0.border-b.border-gray-200.lg_relative.lg_h-16
    .flex.items-center.justify-between.h-full.mx-auto.p-4.lg_p-2.lg_px-3

        //- Search Input
        .hidden.lg_flex.items-center(v-if="showSerch")
            .relative
                input.w-96.text-sm.rounded-md.p-3.placeholder_text-grey-100.focus_outline-none.focus_text-black(v-model="search", name="search", class="bg-[#F6F6FB]", placeholder="Cerca prenotazione", autocomplete="off")        
                span.absolute.inset-y-0.right-0.flex.items-center.pr-3
                    SVGIcon.text-grey-100(svg="search", v-show="!search.length")
                    SVGIcon.text-grey-100.cursor-pointer(svg="close", v-show="search.length", @click="search = ''")

                .absolute.bg-white.z-10.inset-x-0.top-12.rounded-lg.shadow
                    //- show "error" on search
                    .flex.items-center.gap-5.p-4.border-b(v-if="showSearchError")
                        p.pr-1.text-grey-100 Nessun risultato...
                    //- show results
                    .flex.items-center.gap-5.p-4.border-b.font-medium.hover_bg-slate-50(v-else, v-for="item in reservationsSearchList", :key="item.id")
                        p.inline.cursor-pointer.hover_opacity-80(@click="openModal('reservation', item.id)")
                            span.pr-1.text-black.font-semibold {{ item.personName }}
                            span.text-grey-200.text-xs {{ `[#${item.id}]` }}
                        p.antialiased.text-sm.-mb-px {{ formatDate(item.date) }}
                        a.ml-auto.py-1.px-3.text-xs.rounded.bg-primary-100.text-white.cursor-pointer.hover_shadow-md(@click="openModal('reservation', item.id)") APRI

        .flex.md_order-2.lg_hidden
            button.inline-flex.items-center.justify-center.text-sm.text-grey-200.rounded-lg(type="button", @click="toggleMenu",
                class="hover:text-grey-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-expanded="false")
                span.sr-only Open Menu
                SVGIcon(svg="menu", :size="28")

        Menu.absolute.bg-white.z-10.inset-x-0.top-12.border-b(v-show="isMenuOpen", @toggleMenu="toggleMenu()")
            .py-8.bg-primary-100.text-white
                p.mb-3.px-3.text-xs.tracking-widest.font-medium RISTORANTI
                .p-4.flex.items-center.justify-between(v-for="restaurant in restaurantsList" :key="restaurant.id")
                    p.text-sm.cursor-pointer.hover_underline(@click="switchActiveRestaurant(restaurant.id), toggleMenu()") {{ restaurant.name }}
                    SVGIcon.cursor-pointer.hover_text-grey-300(svg="edit", :size="15" @click="openModal('restaurant', restaurant.id), toggleMenu()")
                .mt-2.mx-3.p-3.flex.items-center.justify-between.border.border-dashed.border-white.rounded-lg.cursor-pointer.hover_bg-slate-50(@click="openModal('restaurant'), toggleDropdown()")
                    p.text-sm.leading-normal Aggiungi ristorante
                    SVGIcon(svg="plus", :size="15")         

        //- Admin/Profile - Logout
        .relative.group.ml-auto
            .flex.items-center.text-grey-300
                SVGIcon.ml-2.order-2.lg_mr-2.lg_order-1(svg="user-filled", :size="30")
                SVGIcon.order-3.text-grey-200.lg_hidden(svg="arrow-down", :size="20")
                a.flex.items-center.cursor-pointer.order-1
                    //- p.text-sm {{ user?.user_metadata?.full_name }}
                    p.text-sm {{ user ? 'Admin' : '' }}
                    SVGIcon.text-grey-200.hidden.lg_block(svg="arrow-down", :size="20")
            //- dropdown
            .absolute.hidden.group-hover_block.right-0.-left-8.pt-2
                .py-2.px-4.max-h-40.text-sm.bg-white.border.border-slate-100.rounded-lg.shadow-lg.overflow-y-scroll.z-10
                    p.py-2.leading-normal.text-grey-300.cursor-pointer.hover_text-grey-200(@click="logout") Logout        
</template>