<script setup lang="ts">
// @ts-ignore
import debounce from "lodash.debounce";
import { vOnClickOutside } from "@vueuse/components";

import { storeToRefs } from "pinia";
import { useRestaurantsStore } from "~/stores/Restaurants";
import { useReservationsStore } from "~/stores/Reservations";
const storeRestaurants = useRestaurantsStore();
const { restaurantsList } = storeToRefs(storeRestaurants);
const storeReservations = useReservationsStore();
const { reservationsSearchList } = storeToRefs(storeReservations);
// composables
const { switchActiveRestaurant } = useSwitchActiveRestaurant();
const { openModal } = useOpenModal();
// component's logic
const supabaseClient = useSupabaseClient();
const user = useSupabaseUser();

interface NavbarProps {
  showSerch?: boolean;
}
const props = withDefaults(defineProps<NavbarProps>(), {
  showSerch: true,
});

let search = ref("");
let showSearchError = ref(false);
let isSearchDropdownOpen = ref(false);

let isMenuOpen = ref(false);
function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}
function closeMenu() {
  isMenuOpen.value = false;
}
watch(
  () => isMenuOpen.value,
  () => {
    if (isMenuOpen.value) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
  },
);

function closeSearchDropdown() {
  isSearchDropdownOpen.value = !isSearchDropdownOpen.value;
  search.value = "";
}

async function logout() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) throw new Error();
  else return navigateTo("/");
}

// Use the debounce function to create a debounced version of your callback
const delayedSearch = debounce(async (newSearch: string) => {
  // Remove '#' character from string, in case
  newSearch = newSearch.replace("#", "");
  showSearchError.value = false;
  const data = await storeReservations.fetchReservations(newSearch);
  if (!data || !data.length) {
    showSearchError.value = true;
  } else isSearchDropdownOpen.value = true;
}, 800);
// Watch the search input and call the debounced function
watch(search, (newSearch) => {
  delayedSearch(newSearch);
});
</script>

<template lang="pug">
nav.bg-white.sticky.md_fixed.w-full.h-12.z-20.top-0.left-0.border-b.border-gray-200.md_relative.md_h-16
    .flex.items-center.justify-between.h-full.mx-auto.p-4.md_p-2.md_px-3(v-on-click-outside="closeMenu")
        //- Search Input
        .hidden.md_flex.items-center(v-if="showSerch")
            .relative
                input.w-96.text-sm.rounded-md.p-3.placeholder_text-grey-100.focus_outline-none.focus_text-black(v-model="search", name="search", class="bg-[#F6F6FB]", placeholder="Cerca prenotazione", autocomplete="off")        
                span.absolute.inset-y-0.right-0.flex.items-center.pr-3
                    SVGIcon.text-grey-100(svg="search", v-show="!search.length")
                    SVGIcon.text-grey-100.cursor-pointer(svg="close", v-show="search.length", @click="search = ''")

                .absolute.bg-white.z-10.inset-x-0.top-12.rounded-lg.shadow.overflow-y-auto(class="md_max-h-[20rem]" v-if="search.length > 0 && isSearchDropdownOpen")
                    //- show "error" on search
                    .flex.items-center.gap-5.p-4.border-b(v-if="showSearchError")
                        p.pr-1.text-grey-100 Nessun risultato...
                    //- show results
                    .flex.items-center.gap-5.p-4.border-b.font-medium.hover_bg-slate-50(v-else, v-for="item in reservationsSearchList", :key="item.id")
                        .inline.cursor-pointer.hover_opacity-80(@click="openModal('reservation', item.id); closeSearchDropdown()")
                            p.pr-1.text-black.font-semibold {{ item.personName }}
                            p.text-grey-200.text-xs.tracking-tight {{ `#${item.id}` }}
                        p.antialiased.text-sm.-mb-px {{ useDateFormatting(item.date) }}
                        a.ml-auto.py-1.px-3.text-xs.rounded.bg-primary-100.text-white.cursor-pointer.hover_shadow-md(@click="openModal('reservation', item.id); closeSearchDropdown()") APRI

        //- Mobile - Menu Icon
        .flex.md_order-2.md_hidden
            button.inline-flex.items-center.justify-center.text-sm.text-grey-200.rounded-lg(type="button", @click="toggleMenu()",
                class="hover:text-grey-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-expanded="false")
                span.sr-only Open Menu
                SVGIcon(svg="menu", :size="28")

        AdminMenu.fixed.bg-white.z-20.inset-x-0.top-12.border-b.md_hidden.pb-20.overflow-y-scroll.h-full(class="min-h-[300px]", v-show="isMenuOpen", @toggleMenu="toggleMenu()")
            .py-8.bg-primary-200.text-white
                p.mb-3.px-3.text-xs.tracking-widest.font-medium RISTORANTI
                .p-4.flex.items-center.justify-between(v-for="restaurant in restaurantsList" :key="restaurant.id")
                    p.text-sm.cursor-pointer.hover_underline(@click="switchActiveRestaurant(restaurant.id); closeMenu()") {{ restaurant.name }}
                    SVGIcon.cursor-pointer.hover_text-grey-300(svg="edit", :size="15" @click="openModal('restaurant', restaurant.id); closeMenu()")
                .mt-2.mx-3.p-3.flex.items-center.justify-between.border.border-dashed.border-white.rounded-lg.cursor-pointer(@click="openModal('restaurant'); closeMenu()")
                    p.text-sm.leading-normal Aggiungi ristorante
                    SVGIcon(svg="plus", :size="15")

        //- Admin/Profile - Logout
        .relative.group.ml-auto
            .flex.items-center.text-grey-300
                SVGIcon.ml-2.order-2.md_mr-2.md_order-1(svg="user-filled", :size="30")
                SVGIcon.order-3.text-grey-200.md_hidden(svg="arrow-down", :size="20")
                a.flex.items-center.cursor-pointer.order-1
                    //- p.text-sm {{ user?.user_metadata?.full_name }}
                    p.text-sm {{ supabaseClient ? 'Admin' : '' }}
                    SVGIcon.text-grey-200.hidden.md_block(svg="arrow-down", :size="20")
            //- dropdown
            .absolute.hidden.group-hover_block.right-0.-left-8.pt-2
                .py-2.px-4.max-h-40.text-sm.bg-white.border.border-slate-100.rounded-lg.shadow-lg.z-10
                    p.py-2.leading-normal.text-grey-300.cursor-pointer.hover_text-grey-200(@click="logout") Logout        
</template>
