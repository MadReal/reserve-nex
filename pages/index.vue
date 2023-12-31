<script setup lang="ts">
const i18n = useI18n();
const localePath = useLocalePath();
// definePageMeta({ layout: false, })
useHead({ title: i18n.t("home.page_name") });

const isIT = computed(() => i18n.locale.value === "it");
</script>

<template>
  <div class="page -mt-14 sm_mt-0">
    <ClientHeader />

    <section class="bg-slate-200 px-4 py-20" id="how">
      <div class="mx-auto max-w-screen-md text-center">
        <h2 class="text-3xl font-semibold text-black sm_text-4xl">{{ $t("home.section1.title") }}</h2>
        <p class="mt-3 text-grey-200">{{ $t("home.section1.description") }}</p>

        <div class="my-14 grid grid-cols-2 gap-x-3 gap-y-8 sm_grid-cols-4">
          <ClientLandingPageStep step="1" :text="$t('home.section1.step1')" />
          <ClientLandingPageStep step="2" :text="$t('home.section1.step2')" />
          <ClientLandingPageStep step="3" :text="$t('home.section1.step3')" />
          <ClientLandingPageStep step="4" :text="$t('home.section1.step4')" />
        </div>

        <div>
          <nuxt-link
            :to="{ path: localePath('/'), hash: '#contact' }"
            :prefetch="false"
            class="inline-flex rounded bg-primary-100 px-5 py-3 text-center text-base font-medium uppercase text-white hover_bg-primary-200"
          >
            {{ $t("home.section1.btn_start_now") }}
          </nuxt-link>
        </div>
      </div>
    </section>

    <section class="bg-slate-50 px-4 py-px" id="benefits">
      <div class="mx-auto my-20 max-w-screen-md text-center">
        <h2 class="text-3xl font-semibold text-black sm_text-4xl">{{ $t("home.section2.title") }}</h2>
        <p class="mt-3 text-grey-200">{{ $t("home.section2.description") }}</p>
      </div>

      <div class="mx-auto my-20 flex max-w-screen-lg flex-col gap-4 md_flex-row md_gap-12">
        <div class="relative order-1 mt-4 scale-90 sm_scale-100 md_order-none md_mt-auto md_basis-3/6">
          <div class="absolute -right-5 -top-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-300 text-white">
            <SVGIcon svg="calendar" :size="36" />
          </div>
          <NuxtImg
            class="presentation-img"
            loading="lazy"
            placeholder
            :src="`/images/admin-reservations_${isIT ? 'it' : 'en'}.jpg`"
            width="500px"
          />
        </div>
        <div class="md_mt-14 md_basis-3/6">
          <h3 class="text-2xl font-semibold text-black">{{ $t("home.benefit1.title") }}</h3>
          <p class="text-md text-primary-200">{{ $t("home.benefit1.subtitle") }}</p>
          <p class="mt-2 font-light text-grey-200">{{ $t("home.benefit1.description") }}</p>
        </div>
      </div>

      <div class="mx-auto my-24 flex max-w-screen-lg flex-col gap-4 md_flex-row md_gap-12">
        <div class="md_mt-14 md_basis-3/6">
          <h3 class="text-2xl font-semibold text-black">{{ $t("home.benefit2.title") }}</h3>
          <p class="text-md text-primary-200">{{ $t("home.benefit2.subtitle") }}</p>
          <p class="mt-2 font-light text-grey-200">{{ $t("home.benefit2.description") }}</p>
        </div>
        <div class="relative order-1 mt-4 scale-90 sm_scale-100 md_order-none md_mt-auto md_basis-3/6">
          <div class="absolute -left-5 -top-5 flex h-20 w-20 items-center justify-center rounded-full bg-lime-400 text-white">
            <SVGIcon svg="plus" :size="36" />
          </div>
          <NuxtImg
            class="presentation-img"
            loading="lazy"
            placeholder
            :src="`/images/admin-add-restaurant_${isIT ? 'it' : 'en'}.jpg`"
            width="500px"
          />
        </div>
      </div>

      <div class="mx-auto my-24 flex max-w-screen-lg flex-col gap-4 md_flex-row md_gap-12">
        <div class="relative order-1 mt-4 scale-90 sm_scale-100 md_order-none md_mt-auto md_basis-3/6">
          <div class="absolute -right-5 -top-5 flex h-20 w-20 items-center justify-center rounded-full bg-sky-400 text-white">
            <SVGIcon svg="discount" :size="36" />
          </div>
          <NuxtImg
            class="presentation-img"
            loading="lazy"
            placeholder
            :src="`/images/admin-discount_${isIT ? 'it' : 'en'}.jpg`"
            width="500px"
          />
        </div>
        <div class="md_mt-14 md_basis-3/6">
          <h3 class="text-2xl font-semibold text-black">{{ $t("home.benefit3.title") }}</h3>
          <p class="text-md text-primary-200">{{ $t("home.benefit3.subtitle") }}</p>
          <p class="mt-2 font-light text-grey-200">{{ $t("home.benefit3.description") }}</p>
        </div>
      </div>

      <div class="mx-auto my-24 flex max-w-screen-lg flex-col gap-4 md_flex-row md_gap-12">
        <div class="md_mt-14 md_basis-3/6">
          <h3 class="text-2xl font-semibold text-black">{{ $t("home.benefit4.title") }}</h3>
          <p class="text-md text-primary-200">{{ $t("home.benefit4.subtitle") }}</p>
          <p class="mt-2 font-light text-grey-200">{{ $t("home.benefit4.description") }}</p>
        </div>
        <div class="relative order-1 mt-4 scale-90 sm_scale-100 md_order-none md_mt-auto md_basis-3/6">
          <div class="absolute -left-5 -top-5 flex h-20 w-20 items-center justify-center rounded-full bg-rose-400 text-white">
            <SVGIcon svg="charts" :size="36" />
          </div>
          <NuxtImg class="presentation-img" loading="lazy" placeholder src="/images/meta-google-analytics.jpg" width="500px" />
        </div>
      </div>

      <div class="mx-auto my-24 flex max-w-screen-lg flex-col gap-4 md_flex-row md_gap-12">
        <div class="relative order-1 mt-4 scale-90 sm_scale-100 md_order-none md_mt-auto md_basis-3/6">
          <div class="absolute -right-5 -top-5 flex h-20 w-20 items-center justify-center rounded-full bg-fuchsia-400 text-white">
            <SVGIcon svg="star" :size="36" />
          </div>
          <NuxtImg class="presentation-img" loading="lazy" placeholder src="/images/website-package.jpg" width="500px" />
        </div>

        <div class="md_mt-14 md_basis-3/6">
          <h3 class="text-2xl font-semibold text-black">{{ $t("home.benefit5.title") }}</h3>
          <p class="text-md text-primary-200">{{ $t("home.benefit5.subtitle") }}</p>
          <p class="mt-2 font-light text-grey-200">{{ $t("home.benefit5.description") }}</p>
        </div>
      </div>
    </section>

    <ClientContactForm />
  </div>
</template>

<style lang="sass" scoped>
.presentation-img
  @apply shadow-lg shadow-slate-200
</style>
