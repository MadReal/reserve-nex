<template lang="pug">
.flex
    .min-h-screen.basis-60(class="bg-[#F1F2F7]")
        .h-16.border-b.border-grey-100.py-4.px-8 Restaurant
        .py-4.px-8 sidebar

    nav.grow.h-16.border-b.border-grey-100.py-4.px-8.flex.justify-between 
        .flex.items-center
            .relative
                input.w-96.text-sm.text-white.rounded-md.p-3.placeholder_text-grey-100.focus_outline-none.focus_text-black(name='search', class='bg-[#F6F6FB]', placeholder='Cerca prenotazione', autocomplete='off')        
                span.absolute.inset-y-0.right-0.flex.items-center.pr-3 lol
                    //- SVGIcon.w-6.h-6(icon-name="users")
        div lol
</template>