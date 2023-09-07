<script setup lang="ts">
const routePath = ref(useRoute().path)
const isRouteHome = ref(false)

watchEffect(() => {
    routePath.value = useRoute().path
    isRouteHome.value = routePath.value === '/' ? true : false
})
</script>


<template>
    <nav id="nav"
        class="fixed inset-x-0 top-0 flex flex-row justify-between z-50 text-black bg-white h-14 md_h-min md_bg-transparent"
        :class="{ 'text-white': isRouteHome }">
        <div class="p-4">
            <div class="font-semibold text-xl">
                <nuxt-link to="/"
                    class=" text-black transition duration-300 hover_text-primary-100 focus_text-black">Ristorante</nuxt-link>
            </div>
        </div>

        <!-- Nav Items Working on Tablet & Bigger Sceen -->
        <div class="p-4 text-lg hidden md_flex flex-row justify-between font-semibold">
            <nuxt-link to="/"
                class="mx-4 border-b-2 border-transparent hover_border-b-2 hover_border-primary-200 transition duration-300">Home</nuxt-link>
            <a href="#about"
                class="mx-4 border-b-2 border-transparent hover_border-b-2 hover_border-primary-200 transition duration-300">Menu</a>
            <a href="#contactus"
                class="mx-4 border-b-2 border-transparent hover_border-b-2 hover_border-primary-200 transition duration-300">Contatti
            </a>
            <nuxt-link to="/admin"
                class="mx-4 border-b-2 border-primary-200 hover_border-b-2 hover_border-indigo-300 transition duration-300">Admin</nuxt-link>
        </div>

        <!-- Burger Nav Button on Mobile -->
        <div id="nav-open" class="p-4 md_hidden text-black">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="feather feather-menu">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        </div>
    </nav>
</template>