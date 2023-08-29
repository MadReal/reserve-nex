<script setup lang="ts">

</script>


<template lang="pug">
//- SIDEBAR MENU - Items
.py-6.px-4
    .mb-8
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