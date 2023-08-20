<script setup lang="ts">
import reservations from "@/data/reservations.json";
</script>


<template lang="pug">
.page
    PageTitle(title="Prenotazioni")

    .flex.items-center.gap-5.py-4.border-b.font-medium(v-for="item in reservations", :key="item.id")
        p.inline
            span.pr-1.text-black.font-semibold {{ item.name }}
            span.text-grey-200 {{ `[#${item.id}]` }}
        p.antialiased {{ item.date }}
        .flex.items-center.text-primary-100.antialiased
            SVGIcon.pr-1(svg="users-filled", :size="20")
            p {{ item.people }}
        .flex.items-center.text-grey-100.antialiased
            SVGIcon.pr-1(svg="clock", :size="20")
            p {{ item.time }}

        .ml-auto.flex.gap-2
            a.py-1.px-3.rounded.bg-success-100.text-success-300(v-if="item.accepted === true") Accettata
            a.py-1.px-3.rounded.bg-error-100.text-error-300(v-if="item.accepted === false") Rifiutata
            a.py-1.px-3.rounded.bg-success-200.text-white(v-if="item.accepted === null") Accetta
            a.py-1.px-3.rounded.bg-error-200.text-white(v-if="item.accepted === null") Rifiuta
</template>
