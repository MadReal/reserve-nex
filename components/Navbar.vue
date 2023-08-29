<script setup lang="ts">
const user = useSupabaseUser()
const client = useSupabaseAuthClient()

interface NavbarProps {
    showSerch?: boolean
}
const props = withDefaults(defineProps<NavbarProps>(), {
    showSerch: true
});

async function logout() {
    const { error } = await client.auth.signOut()
    if (error) throw error
    else return navigateTo("/");
}
</script>


<template lang="pug">
//- NAVBAR - Search, Admin
nav.grow.h-16.border-b.border-grey-100.py-4.px-4.flex.justify-between.lg_px-6
    .relative.lg_hidden
        SVGIcon.text-grey-100(svg="menu", :size="28")
        //- .absolute.bg-white.z-10.inset-x-0.inset-y-0
        //-     Menu

    .hidden.lg_flex.items-center(v-if="showSerch")
        .relative
            input.w-96.text-sm.rounded-md.p-3.placeholder_text-grey-100.focus_outline-none.focus_text-black(name='search', class='bg-[#F6F6FB]', placeholder='Cerca prenotazione', autocomplete='off')        
            span.absolute.inset-y-0.right-0.flex.items-center.pr-3
                SVGIcon.text-grey-100(svg="search")
    div
    .relative.group
        .flex.items-center.text-grey-300
            SVGIcon.mr-2(svg="user-filled", :size="30")
            a.flex.items-center.cursor-pointer
                //- p.text-sm {{ user?.user_metadata?.full_name }}
                p.text-sm {{ user ? 'Admin' : '' }}
                SVGIcon.text-grey-200(svg="arrow-down", :size="20")

        //- dropdown
        .absolute.hidden.group-hover_block.right-0.-left-8.pt-2
            .py-2.px-4.max-h-40.text-sm.bg-white.border.border-slate-100.rounded-lg.shadow-lg.overflow-y-scroll.z-10
                p.py-2.leading-normal.text-grey-300.cursor-pointer.hover_text-grey-200(@click="logout") Logout            
</template>