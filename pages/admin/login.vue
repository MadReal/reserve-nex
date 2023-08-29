<script setup lang="ts">
definePageMeta({ layout: false })
const supabase = useSupabaseClient()
const user = useSupabaseUser()

let email = ref('')
let password = ref('')
let errorMessage = ref('')

async function loginWithEmail() {
    let adjustedEmail = email.value === 'admin' ? 'admin@admin.com' : email.value
    const { data, error } = await supabase.auth.signInWithPassword({
        email: adjustedEmail,
        password: password.value,
    })
    if (error) {
        errorMessage.value = error.toString()
        console.log(error);
    } else {
        errorMessage.value = ''
        // const restaurantsStore = JSON.parse(localStorage.getItem("RestaurantsStore")!);
        // console.log(restaurantsStore.activeRestaurantId);
        // return navigateTo("/admin/reservations");
    }
}


const loginWithGoogle = async () => {
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
            input.w-full.text-sm.rounded-md.p-3.border.border-primary-100.bg-transparent.text-white.mb-2.placeholder_text-grey-100.focus_border-white.focus_outline-none(
                v-model="email", name="username", type="text", placeholder="Username", autocomplete="off")        
            input.w-full.text-sm.rounded-md.p-3.border.border-primary-100.bg-transparent.text-white.mb-4.placeholder_text-grey-100.focus_border-white.focus_outline-none(
                v-model="password", name="password", type="password", placeholder="Password", autocomplete="off")        
            button.w-full.text-md.rounded-md.p-3.border.border-primary-100.bg-white.text-black(@click="loginWithEmail()") Login

            p.mt-4.text-red-400 {{ errorMessage }}
        //- p {{ user }}
        //- button.py-2.px-3.rounded-lg.bg-primary-100.text-white(@click="loginWithGoogle") Login With Google
</template>
