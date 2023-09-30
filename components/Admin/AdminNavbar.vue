<script setup lang="ts">
// @ts-ignore
import debounce from "lodash.debounce";
import { vOnClickOutside } from "@vueuse/components";
const { setLocale } = useI18n();

import { storeToRefs } from "pinia";
const storeRestaurants = useRestaurantsStore();
const { restaurantsList } = storeToRefs(storeRestaurants);
const storeReservations = useReservationsStore();
const { reservationsSearchList } = storeToRefs(storeReservations);
// composables
const { switchActiveRestaurant } = useSwitchActiveRestaurant();
const { openModal } = useOpenModal();
// component's logic
const supabaseClient = useSupabaseClient();

interface Props {
  showSerch?: boolean;
}
const props = withDefaults(defineProps<Props>(), { showSerch: true });

let search = ref("");
let showSearchError = ref(false);
let isSearchDropdownOpen = ref(false);

let isMenuOpen = ref(false);
const toggleMenu = () => (isMenuOpen.value = !isMenuOpen.value);
const closeMenu = () => (isMenuOpen.value = false);
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
watch(search, (newSearch) => delayedSearch(newSearch));
</script>

<template>
  <nav class="sticky left-0 top-0 z-20 h-12 w-full border-b border-gray-200 bg-white md_relative md_h-16">
    <div class="mx-auto flex h-full items-stretch justify-between p-4 md_p-2 md_px-4" v-on-click-outside="closeMenu">
      <div class="hidden items-center md_flex" v-if="showSerch">
        <div class="relative">
          <input
            class="w-96 rounded-md bg-[#F6F6FB] p-3 text-sm placeholder_text-grey-100 focus_text-black focus_outline-none"
            v-model="search"
            name="search"
            placeholder="Cerca prenotazione"
            autocomplete="off"
          />
          <span class="absolute inset-y-0 right-0 flex items-center pr-3">
            <SVGIcon class="text-grey-100" svg="search" v-show="!search.length" />
            <SVGIcon class="cursor-pointer text-grey-100" svg="close" v-show="search.length" @click="search = ''" />
          </span>
          <div
            class="absolute inset-x-0 top-12 z-10 overflow-y-auto rounded-lg bg-white shadow md_max-h-[20rem]"
            v-if="search.length &gt; 0 &amp;&amp; isSearchDropdownOpen"
          >
            <div class="flex items-center gap-5 border-b p-4" v-if="showSearchError">
              <p class="pr-1 text-grey-100">Nessun risultato...</p>
            </div>
            <div
              class="flex items-center gap-5 border-b p-4 font-medium hover_bg-slate-50"
              v-else
              v-for="item in reservationsSearchList"
              :key="item.id"
            >
              <div
                class="inline cursor-pointer hover_opacity-80"
                @click="
                  openModal('reservation', item.id);
                  closeSearchDropdown();
                "
              >
                <p class="pr-1 font-semibold text-black">{{ item.personName }}</p>
                <p class="text-xs tracking-tight text-grey-200">{{ `#${item.id}` }}</p>
              </div>
              <p class="-mb-px text-sm antialiased">{{ useDateFormatting(item.date) }}</p>
              <a
                class="ml-auto cursor-pointer rounded bg-primary-100 px-3 py-1 text-xs text-white hover_shadow-md"
                @click="
                  openModal('reservation', item.id);
                  closeSearchDropdown();
                "
                >APRI</a
              >
            </div>
          </div>
        </div>
      </div>

      <div class="flex md_order-2 md_hidden">
        <button
          class="hover:text-grey-100 focus:outline-none focus:ring-2 focus:ring-gray-200 inline-flex items-center justify-center rounded-lg text-sm text-grey-200"
          type="button"
          @click="toggleMenu()"
          aria-expanded="false"
        >
          <span class="sr-only">Open Menu</span>
          <SVGIcon svg="menu" :size="28" />
        </button>
      </div>

      <AdminMenu
        class="fixed inset-x-0 top-12 z-20 h-full min-h-[300px] overflow-y-scroll border-b bg-white pb-20 md_hidden"
        v-show="isMenuOpen"
        @toggleMenu="toggleMenu()"
      >
        <div class="bg-primary-200 py-8 text-white">
          <p class="mb-3 px-3 text-xs font-medium tracking-widest">RISTORANTI</p>
          <div class="flex items-center justify-between p-4" v-for="restaurant in restaurantsList" :key="restaurant.id">
            <p
              class="cursor-pointer text-sm hover_underline"
              @click="
                switchActiveRestaurant(restaurant.id);
                closeMenu();
              "
            >
              {{ restaurant.name }}
            </p>
            <SVGIcon
              class="cursor-pointer hover_text-grey-300"
              svg="edit"
              :size="15"
              @click="
                openModal('restaurant', restaurant.id);
                closeMenu();
              "
            />
          </div>

          <div
            class="mx-3 mt-2 flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-white p-3"
            @click="
              openModal('restaurant');
              closeMenu();
            "
          >
            <p class="text-sm leading-normal">Aggiungi ristorante</p>
            <SVGIcon svg="plus" :size="15" />
          </div>
        </div>
      </AdminMenu>

      <div class="ml-auto mr-2 flex h-4/6 items-center self-center rounded-md border border-black/20 text-black">
        <div class="cursor-pointer px-2 text-xs hover_text-primary-100" @click.prevent.stop="setLocale('it')">
          <p>IT</p>
        </div>
        <div class="h-full w-px bg-black/20"></div>
        <div class="cursor-pointer px-2 text-xs hover_text-primary-100" @click.prevent.stop="setLocale('en')">
          <p>EN</p>
        </div>
      </div>

      <div class="group relative self-center">
        <div class="flex items-center text-grey-300">
          <SVGIcon class="order-2 ml-2 md_order-1 md_mr-2" svg="user-filled" :size="30" />
          <SVGIcon class="order-3 text-grey-200 md_hidden" svg="arrow-down" :size="20" />
          <a class="order-1 flex cursor-pointer items-center">
            <p class="text-sm">{{ supabaseClient ? "Admin" : "" }}</p>
            <SVGIcon class="hidden text-grey-200 md_block" svg="arrow-down" :size="20" />
          </a>
        </div>
        <div class="absolute -left-8 right-0 hidden pt-2 group-hover_block">
          <div class="z-10 max-h-40 rounded-lg border border-slate-100 bg-white px-4 py-2 text-sm shadow-lg">
            <p class="cursor-pointer py-2 leading-normal text-grey-300 hover_text-grey-200" @click="logout">Logout</p>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
