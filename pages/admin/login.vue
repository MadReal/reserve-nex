<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Login', })

const supabase = useSupabaseClient()
// const user = useSupabaseUser()

let email = ref('admin')
let password = ref('admin')
let errorMessage = ref('')

async function loginWithEmail() {
    let adjustedEmail = email.value === 'admin' ? 'admin@admin.com' : email.value
    const { data, error } = await supabase.auth.signInWithPassword({
        email: adjustedEmail,
        password: password.value,
    })
    if (error) {
        errorMessage.value = error.toString()
        console.error(error);
        throw error
    } else {
        errorMessage.value = ''
        return navigateTo("/admin/reservations");
    }
}

// const loginWithGoogle = async () => {
//     const { data, error } = await supabase.auth.signInWithOAuth({
//         provider: 'google',
//     })
//     if (error) console.error(error);
// }
</script>


<template>
    <div class="page__content h-screen bg-primary-200 relative !mt-0">
        <NuxtLink class="absolute top-3 right-3" to="/">
            <SVGIcon class="text-white" svg="close" :size="34"></SVGIcon>
        </NuxtLink>
        <div class="flex items-center justify-center h-full">
            <div class="text-center">
                <p class="text-2xl font-semibold text-white">Ciao, Admin!</p>
                <p class="text-base font-light text-white tracking-wide mb-5">Entra nel tuo account</p>
                <form>
                    <input
                        class="w-full text-sm rounded-md p-3 border border-primary-100 bg-transparent text-white mb-2 placeholder_text-grey-100 focus_border-white focus_outline-none"
                        v-model="email" name="username" type="text" placeholder="Username" autocomplete="off" />
                    <input
                        class="w-full text-sm rounded-md p-3 border border-primary-100 bg-transparent text-white mb-4 placeholder_text-grey-100 focus_border-white focus_outline-none"
                        v-model="password" name="password" type="password" placeholder="Password" autocomplete="off" />
                    <button class="w-full text-base rounded-md p-3 border border-primary-100 bg-white text-black"
                        type="submit" @click.prevent="loginWithEmail()">Login</button>
                </form>
                <p class="mt-4 text-red-400">{{ errorMessage }}</p>
            </div>
        </div>
    </div>
</template>
