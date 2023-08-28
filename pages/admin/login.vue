<script setup lang="ts">
definePageMeta({
    // layout: 'custom',
    layout: false,

})

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const login = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
    })
    if (error) console.log(error);
    console.log(data);

}
</script>


<template lang="pug">
.page.h-screen.bg-primary-200
    .flex.items-center.justify-center.h-full
        div.text-center
            p.text-2xl.font-semibold.text-white Ciao, Admin!
            p.text-md.font-light.text-white.tracking-wide.mb-5 Entra nel tuo account
            input.w-full.text-sm.rounded-md.p-3.border.border-primary-100.bg-transparent.text-white.mb-2.placeholder_text-grey-100.focus_outline-none(name='username', placeholder='Username', autocomplete='off')        
            input.w-full.text-sm.rounded-md.p-3.border.border-primary-100.bg-transparent.text-white.mb-4.placeholder_text-grey-100.focus_outline-none(name='password', placeholder='Password', autocomplete='off')        
            button.w-full.text-md.rounded-md.p-3.border.border-primary-100.bg-white.text-black Login

        //- p {{ user }}
        //- button.py-2.px-3.rounded-lg.bg-primary-100.text-white(@click="login") Login With Google

</template>
