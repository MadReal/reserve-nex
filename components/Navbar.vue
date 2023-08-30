<script setup lang="ts">


</script>


<template lang="pug">
nav.border-gray-200.z-20.relative.text-white
    .max-w-screen-xl.flex.flex-wrap.items-center.justify-between.mx-auto.p-4
        a.flex.items-center(href='https_//flowbite.com/')
            span.self-center.text-2xl.font-semibold.whitespace-nowrap Restaurant
        button.inline-flex.items-center.p-2.w-10.h-10.justify-center.text-sm.text-gray-500.rounded-lg(data-collapse-toggle='navbar-default', type='button', class='md_hidden hover_bg-gray-100 focus_outline-none focus_ring-2 focus_ring-gray-200 dark_text-gray-400 dark_hover_bg-gray-700 dark_focus_ring-gray-600', aria-controls='navbar-default', aria-expanded='false')
            span.sr-only Open main menu
            svg.w-5.h-5(aria-hidden='true', xmlns='http_//www.w3.org/2000/svg', fill='none', viewbox='0 0 17 14')
                path(stroke='currentColor', stroke-linecap='round', stroke-linejoin='round', stroke-width='2', d='M1 1h15M1 7h15M1 13h15')

        #navbar-default.hidden.w-full(class='md_block md_w-auto')
            ul.font-medium.flex.flex-col.p-4.mt-4.rounded-lg(class='md_p-0 md_flex-row md_space-x-8 md_mt-0')
                li
                    a.block.py-2.pl-3.pr-4.text-gray-900.rounded.md_hover_text-red-700.md_p-0(href='#') Home
                li
                    a.block.py-2.pl-3.pr-4.text-gray-900.rounded.md_hover_text-red-700.md_p-0(href='#') Menu
                li
                    a.block.py-2.pl-3.pr-4.text-gray-900.rounded.md_hover_text-red-700.md_p-0(href='#') Prenota
                li
                    NuxtLink.py-2.px-3.bg-white.text-black.rounded.hover_shadow(to="/admin/reservations") Admin
</template>