<script setup lang="ts">
// definePageMeta({ layout: false, })
const backgroundImage = "url('/images/sushisamba.jpg')"

</script>


<template lang="pug">
.page.relative.-mt-16.z-0
    //- section
    section.bg-gradient-to-b.from-red-500.to-gray-700.pt-2
        .h-full.w-full.bg-no-repeat.bg-cover.bg-bottom.absolute.top-0.inset-x-0.-z-0(:style="{'background-image': backgroundImage}").opacity-40
        .max-w-screen-xl.px-4.py-48.mx-auto.z-10.relative
            .mr-auto.place-self-center(class='lg_col-span-7')
            h1.lg_max-w-2xl.mb-4.text-4xl.font-extrabold.tracking-tight.leading-none.md_text-5xl.xl_text-6xl.text-white
                | Rilassati in un'atmosfera calda e raffinata
            p.lg_max-w-2xl.mb-4.font-light.text-gray-200.lg_mb-4.md_text-lg.lg_text-xl
                | L'unione tra i migliori prodotti gastronomici del Mediterraneo e l'arte del sushi giapponese, dando vita a straordinari Gunkan.
            a.inline-flex.items-center.justify-center.px-5.py-3.mr-3.text-base.font-medium.text-center.text-white.rounded-lg.bg-red-600.hover_bg-red-500.focus_ring-4.focus_ring-primary-300(href='#')
                | Prenota
                SVGIcon.w-5.h-5.ml-2.-mr-1(svg="calendar")
            //- a.inline-flex.items-center.justify-center.px-5.py-3.text-base.font-medium.text-center.text-gray-900.border.border-gray-300.rounded-lg.hover_bg-gray-100.focus_ring-4.focus_ring-gray-100(href='#')
            //-     | Speak to Sales
            //- NuxtImg.hidden.lg_mt-0.lg_col-span-5.lg_block.absolute.top-0.inset-x-0.-z-0.h-60(src="/images/sushisamba.jpg", alt='mockup')


    //- .container
    //-     p.mb-4 Index
</template>
