<script setup lang="ts">


</script>


<template lang="pug">
.min-h-screen.basis-60(class="bg-[#F1F2F7]")
    //- SIDEBAR MENU - Restaurant Profile
    .flex.items-center.h-16.border-b.border-grey-100.py-4.px-6
        div.mr-1(class="basis-1/5")
            .w-8.h-8.bg-red-300.rounded-full
        p.text-sm.break-words(class="basis-3/5") Officina Del Riso (Navigli)
        SVGIcon.text-grey-200(svg="arrow-down", :size="20")

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