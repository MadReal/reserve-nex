<script setup lang="ts">
// https://medium.com/@ngoctranfire/using-prisma-with-supabase-row-level-security-and-multi-schema-7c53418adba3
definePageMeta({ layout: false });
useHead({ title: "Login" });

import { useAuthStore } from "~/stores/Auth";
const storeAuth = useAuthStore();

const supabase = useSupabaseClient();
// const user = useSupabaseUser()

let email = ref("admin");
let password = ref("admin");
let errorMessage = ref("");

async function loginWithEmail() {
  let adjustedEmail = email.value === "admin" ? "admin@admin.com" : email.value;
  const { data, error } = await supabase.auth.signInWithPassword({ email: adjustedEmail, password: password.value });

  if (error) {
    errorMessage.value = error.toString();
    console.error(error);
    throw new Error();
  } else {
    errorMessage.value = "";
    // TODO: handle the error better, in case data.session.access_token is null or undefined, don't proceed
    const { data } = await supabase.auth.getSession();
    const authToken: string = data.session ? data.session.access_token : "";

    storeAuth.setAuthToken(authToken);
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
  <div class="page__content relative !my-0 h-screen bg-primary-200">
    <NuxtLink class="absolute right-3 top-3" to="/">
      <SVGIcon class="text-white" svg="close" :size="34"></SVGIcon>
    </NuxtLink>
    <div class="flex h-full items-center justify-center">
      <div class="text-center">
        <p class="text-2xl font-semibold text-white">Ciao, Admin!</p>
        <p class="mb-5 text-base font-light tracking-wide text-white">Entra nel tuo account</p>
        <form>
          <input
            class="mb-2 w-full rounded-md border border-primary-100 bg-transparent p-3 text-sm text-white placeholder_text-grey-100 focus_border-white focus_outline-none"
            v-model="email"
            name="username"
            type="text"
            placeholder="Username"
            autocomplete="off"
          />
          <input
            class="mb-4 w-full rounded-md border border-primary-100 bg-transparent p-3 text-sm text-white placeholder_text-grey-100 focus_border-white focus_outline-none"
            v-model="password"
            name="password"
            type="password"
            placeholder="Password"
            autocomplete="off"
          />
          <button
            class="w-full rounded-md border border-primary-100 bg-white p-3 text-base text-black"
            type="submit"
            @click.prevent="loginWithEmail()"
          >
            Login
          </button>
        </form>
        <p class="mt-4 text-red-400">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>
