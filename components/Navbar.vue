<script setup lang="ts">
const user = useSupabaseUser()
const client = useSupabaseAuthClient()

interface NavbarProps {
    showSerch?: boolean
}
const props = withDefaults(defineProps<NavbarProps>(), {
    showSerch: true
});

let isMenuOpen = ref(false)
function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value
}

async function logout() {
    const { error } = await client.auth.signOut()
    if (error) throw error
    else return navigateTo("/");
}
</script>


<template lang="pug">
nav.bg-white.fixed.w-full.h-16.z-20.top-0.left-0.border-b.border-gray-200.lg_relative
    .flex.items-center.justify-between.h-full.mx-auto.p-4.lg_p-2.lg_px-3

        .hidden.lg_flex.items-center(v-if="showSerch")
            .relative
                input.w-96.text-sm.rounded-md.p-3.placeholder_text-grey-100.focus_outline-none.focus_text-black(name="search", class="bg-[#F6F6FB]", placeholder="Cerca prenotazione", autocomplete="off")        
                span.absolute.inset-y-0.right-0.flex.items-center.pr-3
                    SVGIcon.text-grey-100(svg="search")

        .flex.md_order-2.lg_hidden
            button.inline-flex.items-center.justify-center.text-sm.text-grey-200.rounded-lg(type="button", @click="toggleMenu",
                class="hover:text-grey-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-expanded="false")
                span.sr-only Open Menu
                SVGIcon(svg="menu", :size="28")

        Menu.absolute.bg-white.z-10.inset-x-0.top-16.border-b.py-3(v-show="isMenuOpen", @toggleMenu="toggleMenu()")

        .relative.group
            .flex.items-center.text-grey-300
                SVGIcon.ml-2.order-2.lg_mr-2.lg_order-1(svg="user-filled", :size="30")
                SVGIcon.order-3.text-grey-200.lg_hidden(svg="arrow-down", :size="20")
                a.flex.items-center.cursor-pointer.order-1
                    //- p.text-sm {{ user?.user_metadata?.full_name }}
                    p.text-sm {{ user ? 'Admin' : '' }}
                    SVGIcon.text-grey-200.hidden.lg_block(svg="arrow-down", :size="20")
            //- dropdown
            .absolute.hidden.group-hover_block.right-0.-left-8.pt-2
                .py-2.px-4.max-h-40.text-sm.bg-white.border.border-slate-100.rounded-lg.shadow-lg.overflow-y-scroll.z-10
                    p.py-2.leading-normal.text-grey-300.cursor-pointer.hover_text-grey-200(@click="logout") Logout        
</template>