<script setup lang="ts">

</script>


<template lang="pug">
.lg_py-6.lg_px-4
    .mb-8
        p.hidden.px-4.mb-3.text-xs.tracking-widest.text-grey-200.lg_px-3.lg_block MENU

        NuxtLink.router-link.flex.items-center.p-4.cursor-pointer.group(to="/admin/reservations" class="", @click="$emit('toggleMenu')")
            SVGIcon.text-grey-100.mr-2.group-hover_text-grey-200(svg="check", :size="20")
            p.text-sm.text-grey-200.tracking-wide Prenotazioni
        NuxtLink.router-link.flex.items-center.p-4.cursor-pointer.group(to="/admin/day-summary", @click="$emit('toggleMenu')")
            SVGIcon.text-grey-100.mr-2.group-hover_text-grey-200(svg="calendar", :size="20")
            p.text-sm.text-grey-200.tracking-wide Riepilogo Giorno
        NuxtLink.router-link.flex.items-center.p-4.cursor-pointer.group(to="/admin/edit-time-open", @click="$emit('toggleMenu')")
            SVGIcon.text-grey-100.mr-2.group-hover_text-grey-200(svg="clock", :size="20")
            p.text-sm.text-grey-200.tracking-wide Gestione Orari

    .mb-8
        p.mb-3.px-3.text-xs.tracking-widest.text-grey-200 GESTIONE BLOCCHI

        NuxtLink.router-link.flex.items-center.p-4.cursor-pointer.group(to="/admin/blocked-days", @click="$emit('toggleMenu')")
            SVGIcon.text-grey-100.mr-2.group-hover_text-grey-200(svg="block", :size="20")
            p.text-sm.text-grey-200.tracking-wide Blocco Giorni
        NuxtLink.router-link.flex.items-center.p-4.cursor-pointer.group(to="/admin/blocked-time", @click="$emit('toggleMenu')")
            SVGIcon.text-grey-100.mr-2.group-hover_text-grey-200(svg="block", :size="20")
            p.text-sm.text-grey-200.tracking-wide Blocco Orari

    slot
</template>