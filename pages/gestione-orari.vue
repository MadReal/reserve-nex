<script setup lang="ts">
import workHours from "@/data/work-hours.json";
</script>


<template lang="pug">
.page
    PageTitle(title="Gestione Orari")

    .grid(class="grid-cols-[1fr_1px_1fr]").gap-6.border-b
        //- Pranzo
        div.mb-6
            p.mb-4 Pranzo
            .flex.items-center.justify-between.border.rounded.py-2.px-3.mb-2(v-for="time in workHours.pranzo", key="time")
                p.text-grey-300 {{ time }}
                SVGIcon.-mt-1.text-grey-300(svg="trash", :size="15")
            .flex.items-center.justify-between.border.border-dashed.border-primary-100.rounded.py-2.px-3.mb-2
                p.text-primary-100 Aggiungi Orario
                SVGIcon.-mt-1.text-primary-100(svg="plus", :size="15")
            .flex.items-center.justify-between.border.border-primary-200.rounded.py-2.px-3.mb-2.relative
                p.text-primary-200 Seleziona Orario
                SVGIcon.text-primary-200(svg="arrow-down", :size="22" class="-mr-1")

        //- Divider
        .h-full.border-r

        //- Cena
        div

</template>
