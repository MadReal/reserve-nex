<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";
const routeName = computed(() => useRoute().name);
const localePath = useLocalePath();

const hasScrolled = ref(false); // obtain the reference
const isRouteHome = computed(() => useRoute().path === "/");
const isNavTextWhite = computed(() => !hasScrolled.value && routeName.value !== "reservation");
const isNavTextBlack = computed(() => hasScrolled.value);
const isNavBgTransp = computed(() => !hasScrolled.value);
const hideOnReservationDesktop = computed(() => routeName.value === "reservation-restaurantId");

let isMenuOpen = ref(false);
const toggleMenu = () => (isMenuOpen.value = !isMenuOpen.value);
const closeMenu = () => (isMenuOpen.value = false);

onMounted(() => {
  window.addEventListener("scroll", () => {
    var curr = window.scrollY;
    if (curr >= 15) hasScrolled.value = true;
    else hasScrolled.value = false;
  });
});
</script>

<template>
  <nav
    id="nav"
    class="sticky inset-x-0 top-0 z-40 flex h-14 justify-between transition duration-100 md_fixed md_h-min"
    :class="{
      'text-white ': isNavTextWhite,
      'bg-white text-black': isNavTextBlack,
      'md_bg-transparent': isNavBgTransp,
    }"
  >
    <div class="p-4">
      <div class="text-xl font-semibold">
        <NuxtLink
          to="/"
          class="transition duration-200 hover_text-primary-100 focus_text-black"
          :class="{ 'sm_text-black': isRouteHome, 'text-white': isRouteHome && !hasScrolled }"
          >ReserveNex
        </NuxtLink>
      </div>
    </div>

    <!-- Nav Items Working on Tablet & Bigger Sceen -->
    <div class="text-md hidden justify-between p-4 font-semibold md_flex">
      <NuxtLink :to="localePath('/')" class="navbar-item" :class="{ hidden: hideOnReservationDesktop }">Home </NuxtLink>
      <NuxtLink
        :to="{ path: localePath('/'), hash: '#how' }"
        :prefetch="false"
        class="navbar-item"
        :class="{ hidden: hideOnReservationDesktop }"
      >
        {{ $t("home.navbar.how_it_works") }}
      </NuxtLink>
      <NuxtLink
        :to="{ path: localePath('/'), hash: '#benefits' }"
        :prefetch="false"
        class="navbar-item"
        :class="{ hidden: hideOnReservationDesktop }"
      >
        {{ $t("home.navbar.benefits") }}
      </NuxtLink>
      <NuxtLink
        :to="{ path: localePath('/'), hash: '#contact' }"
        :prefetch="false"
        class="navbar-item"
        :class="{ hidden: hideOnReservationDesktop }"
      >
        {{ $t("home.navbar.contact") }}
      </NuxtLink>
      <NuxtLink :to="localePath('/admin')" class="navbar-item-admin" :class="{ hidden: hideOnReservationDesktop }">
        {{ $t("home.navbar.admin") }}
      </NuxtLink>

      <LanguageSwitch :hasScrolled="hasScrolled" />
    </div>

    <!-- Burger Nav Button on Mobile -->
    <div class="self-center px-4 md_hidden" v-on-click-outside="closeMenu">
      <div
        id="nav-open"
        class="flex items-center gap-3 text-black md_hidden"
        :class="{
          'text-black': hasScrolled,
          'text-white': (isRouteHome || routeName === 'reservation-restaurantId') && !hasScrolled,
        }"
        @click="toggleMenu()"
      >
        <LanguageSwitch :hasScrolled="hasScrolled" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-menu"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </div>

      <div class="absolute inset-x-0 top-14 z-10 border-b bg-white" v-show="isMenuOpen">
        <div class="text-black">
          <ul class="mb-8 mt-1">
            <li class="px-2 py-3" @click="toggleMenu()"><NuxtLink :to="localePath('/')" class="navbar-item">Home</NuxtLink></li>
            <li class="px-2 py-3" @click="toggleMenu()">
              <NuxtLink
                :to="{ path: localePath('/'), hash: '#how' }"
                :prefetch="false"
                class="navbar-item"
                :class="{ hidden: hideOnReservationDesktop }"
              >
                {{ $t("home.navbar.how_it_works") }}
              </NuxtLink>
            </li>
            <li class="px-2 py-3" @click="toggleMenu()">
              <NuxtLink
                :to="{ path: localePath('/'), hash: '#benefits' }"
                :prefetch="false"
                class="navbar-item"
                :class="{ hidden: hideOnReservationDesktop }"
              >
                {{ $t("home.navbar.benefits") }}
              </NuxtLink>
            </li>
            <li class="px-2 py-3" @click="toggleMenu()">
              <NuxtLink
                :to="{ path: localePath('/'), hash: '#contact' }"
                :prefetch="false"
                class="navbar-item"
                :class="{ hidden: hideOnReservationDesktop }"
              >
                {{ $t("home.navbar.contact") }}
              </NuxtLink>
            </li>
            <li class="px-2 py-3" @click="toggleMenu()">
              <NuxtLink to="/admin" class="navbar-item-admin">{{ $t("home.navbar.admin") }}</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<style lang="sass" scoped>
.navbar-default
    @apply mx-3 border-b-2 transition duration-200 hover_border-b-2 cursor-pointer
.navbar-item
    @apply navbar-default border-transparent hover_border-primary-200
.navbar-item-admin
    @apply navbar-default border-primary-200 hover_border-indigo-300
</style>
