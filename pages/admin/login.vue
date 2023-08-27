<script setup lang="ts">
definePageMeta({
    layout: 'custom'
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
.page.mt-10
    button.py-2.px-3.rounded-lg.bg-primary-100.text-white(@click="login") Login With Google

    p {{ user }}
</template>
