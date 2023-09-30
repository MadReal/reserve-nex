<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";
const routeName = computed(() => useRoute().name);
const { locale, setLocale } = useI18n();
const localePath = useLocalePath();
const isIT = computed(() => locale.value === "it");

const hasScrolled = ref(); // obtain the reference
const isRouteHome = computed(() => useRoute().path === "/");
const isNavTextWhite = computed(() => !hasScrolled.value && routeName.value !== "reservation");
const isNavTextBlack = computed(() => hasScrolled.value || routeName.value === "reservation");
const isNavBgTransp = computed(() => !hasScrolled.value);

let isMenuOpen = ref(false);
const toggleMenu = () => (isMenuOpen.value = !isMenuOpen.value);
const closeMenu = () => (isMenuOpen.value = false);

onMounted(() => {
  window.addEventListener("scroll", () => {
    var curr = window.scrollY;

    if (curr >= 80) hasScrolled.value = true;
    else hasScrolled.value = false;
  });
});
</script>

<template>
  <nav
    id="nav"
    class="sticky inset-x-0 top-0 z-40 flex h-14 flex-row justify-between transition duration-100 md_fixed md_h-min"
    :class="{
      'text-white ': isNavTextWhite,
      'bg-white text-black': isNavTextBlack,
      'md_bg-transparent': isNavBgTransp,
    }"
  >
    <div class="p-4">
      <div class="text-xl font-semibold">
        <nuxt-link
          to="/"
          class="transition duration-200 hover_text-primary-100 focus_text-black"
          :class="{ 'text-black': isRouteHome }"
          >Ristorante</nuxt-link
        >
      </div>
    </div>

    <!-- Nav Items Working on Tablet & Bigger Sceen -->
    <div class="hidden flex-row justify-between p-4 text-lg font-semibold md_flex">
      <nuxt-link :to="localePath('/')" class="navbar-item">Home</nuxt-link>
      <nuxt-link :to="{ path: localePath('/'), hash: '#how' }" :prefetch="false" class="navbar-item">
        {{ $t("home.navbar.how_it_works") }}
      </nuxt-link>
      <nuxt-link :to="{ path: localePath('/'), hash: '#benefits' }" :prefetch="false" class="navbar-item">
        {{ $t("home.navbar.benefits") }}
      </nuxt-link>
      <nuxt-link :to="localePath('/admin')" class="navbar-item-admin">
        {{ $t("home.navbar.admin") }}
      </nuxt-link>

      <div
        class="flex items-center overflow-hidden rounded-md border"
        :class="{ 'border-white/20 text-white': isNavTextWhite, 'border-black/20 text-black': isNavTextBlack }"
      >
        <div
          class="flex h-full cursor-pointer items-center px-2 text-xs hover_text-primary-100"
          :class="{ 'bg-black/10': isIT && isNavTextBlack, 'bg-white/10': isIT && isNavTextWhite }"
          @click.prevent.stop="setLocale('it')"
        >
          <p>IT</p>
        </div>
        <div class="h-full w-px" :class="{ 'bg-white/20': isNavTextWhite, 'bg-black/20': isNavTextBlack }"></div>
        <div
          class="flex h-full cursor-pointer items-center px-2 text-xs hover_text-primary-100"
          :class="{ 'bg-black/10': !isIT && isNavTextBlack, 'bg-white/10': !isIT && isNavTextWhite }"
          @click.prevent.stop="setLocale('en')"
        >
          <p>EN</p>
        </div>
      </div>
    </div>

    <!-- Burger Nav Button on Mobile -->
    <div class="md_hidden" v-on-click-outside="closeMenu">
      <div id="nav-open" class="p-4 text-black md_hidden" @click="toggleMenu()">
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
            <li class="py-3" @click="toggleMenu()"><nuxt-link :to="localePath('/')" class="navbar-item">Home</nuxt-link></li>
            <li class="py-3" @click="toggleMenu()"><a class="navbar-item">Come funziona</a></li>
            <li class="py-3" @click="toggleMenu()"><a class="navbar-item">Vantaggi </a></li>
            <li class="py-3" @click="toggleMenu()">
              <nuxt-link to="/admin" class="navbar-item-admin">Vedi Gestionale</nuxt-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<style lang="sass" scoped>
.navbar-default
    @apply mx-4 border-b-2 transition duration-200 hover_border-b-2 cursor-pointer
.navbar-item
    @apply navbar-default border-transparent hover_border-primary-200
.navbar-item-admin
    @apply navbar-default border-primary-200 hover_border-indigo-300
</style>
