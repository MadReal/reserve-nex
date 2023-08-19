<script setup lang="ts">

</script>


<template lang="pug">
//- NAVBAR - Search, Admin
nav.grow.h-16.border-b.border-grey-100.py-4.px-6.flex.justify-between
    .flex.items-center
        .relative
            input.w-96.text-sm.rounded-md.p-3.placeholder_text-grey-100.focus_outline-none.focus_text-black(name='search', class='bg-[#F6F6FB]', placeholder='Cerca prenotazione', autocomplete='off')        
            span.absolute.inset-y-0.right-0.flex.items-center.pr-3
                SVGIcon.text-grey-100(svg="search")
    .flex.items-center.text-grey-300
        SVGIcon.mr-2(svg="user-filled", :size="30")
        a.flex.items-center.cursor-pointer
            p.text-sm Admin
            SVGIcon.text-grey-200(svg="arrow-down", :size="24")
</template>