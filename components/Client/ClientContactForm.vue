<script setup lang="ts">
const i18n = useI18n();

const form = ref({ email: "", name: "", message: "" });
const formStatus = ref({ message: "", isError: false });

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

async function handleSubmit(event: any) {
  event.preventDefault();

  const myForm = new FormData(event.target);
  try {
    await useFetch("https://formspree.io/f/xgejpzoy", { method: "POST", body: myForm, headers: { Accept: "application/json" } });
    formStatus.value.message = i18n.t("home.contact.form_success_message");
    formStatus.value.isError = false;
    form.value = { email: "", name: "", message: "" };
  } catch (error: any) {
    formStatus.value.isError = true;
    formStatus.value.message = i18n.t("home.contact.form_error_message");
    console.error(error);
  }
}
</script>

<template>
  <section class="bg-slate-200 px-4 pb-16 pt-20" id="contact">
    <div class="mx-auto max-w-screen-sm">
      <h4 class="text-center text-3xl font-semibold text-black">{{ $t("home.contact.title") }}</h4>
      <p class="mb-7 mt-3 text-center text-grey-200">{{ $t("home.contact.subtitle") }}</p>
      <form id="contact-form" @submit.prevent="handleSubmit">
        <div class="flex gap-x-4">
          <div class="grow">
            <label class="text-xs capitalize" for="name">{{ $t("home.contact.input_name") }}*</label>
            <input
              class="mb-2 w-full rounded-md border border-grey-100 bg-transparent p-3 text-sm text-black focus_border-grey-300 focus_outline-none"
              v-model="form.name"
              name="name"
              id="name"
              type="name"
              :placeholder="`${capitalize($t('home.contact.input_name_placeholder'))}`"
              autocomplete="name"
              required
            />
          </div>
          <div class="grow">
            <label class="text-xs capitalize" for="email">Email*</label>
            <input
              class="mb-2 w-full rounded-md border border-grey-100 bg-transparent p-3 text-sm text-black focus_border-grey-300 focus_outline-none"
              v-model="form.email"
              name="email"
              id="email"
              type="email"
              :placeholder="`${capitalize($t('home.contact.input_email_placeholder'))}`"
              autocomplete="email"
              required
            />
          </div>
        </div>
        <label class="text-xs capitalize" for="message">{{ $t("home.contact.input_message") }}*</label>
        <textarea
          rows="4"
          class="mb-2 w-full rounded-md border border-grey-100 bg-transparent p-3 text-sm text-black focus_border-grey-300 focus_outline-none"
          v-model="form.message"
          name="message"
          id="message"
          type="text"
          :placeholder="`${capitalize($t('home.contact.input_message_placeholder'))}`"
          required
        />
        <p
          v-show="formStatus.message"
          class="text-center"
          :class="{ 'text-success-200': !formStatus.isError, 'text-error-200': formStatus.isError }"
        >
          {{ formStatus.message }}
        </p>
        <div class="flex">
          <button
            type="submit"
            class="ml-auto rounded bg-primary-100 px-5 py-3 text-center text-base font-medium uppercase text-white hover_bg-primary-200"
          >
            {{ $t("home.contact.btn_submit") }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>
