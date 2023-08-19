<template lang="pug">
.flex
    .min-h-screen.basis-60(class="bg-[#F1F2F7]")
        .flex.items-center.h-16.border-b.border-grey-100.py-4.px-6
            div.mr-1(class="basis-1/5")
                .w-8.h-8.bg-red-300.rounded-full
            p.text-sm.break-words(class="basis-3/5") Officina Del Riso (Navigli)
            SVGIcon.text-grey-200(svg="arrow-down", :size="24")

        .py-6.px-4
            .mb-8.mt-4
                p.mb-3.px-3.text-xs.tracking-wide.text-grey-200 MENU

                .flex.items-center.py-4.px-3
                    SVGIcon.text-grey-100.mr-2(svg="check", :size="20")
                    p.text-sm.text-grey-200 Prenotazioni
                .flex.items-center.py-4.px-3
                    SVGIcon.text-grey-100.mr-2(svg="calendar", :size="20")
                    p.text-sm.text-grey-200 Riepilogo Giorni
                .flex.items-center.py-4.px-3
                    SVGIcon.text-grey-100.mr-2(svg="clock", :size="20")
                    p.text-sm.text-grey-200 Gestione Orari


            .my-8
                p.mb-3.px-3.text-xs.tracking-wide.text-grey-200 GESTIONE BLOCCHI

                .flex.items-center.py-4.px-3
                    SVGIcon.text-grey-100.mr-2(svg="block", :size="20")
                    p.text-sm.text-grey-200 Blocco Giorni
                .flex.items-center.py-4.px-3
                    SVGIcon.text-grey-100.mr-2(svg="block", :size="20")
                    p.text-sm.text-grey-200 Blocco Orari

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