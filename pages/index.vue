<script setup lang="ts">
// definePageMeta({ layout: false, })
useHead({ title: "Ristorante" });
const { locale } = useI18n();
const isIT = computed(() => locale.value === "it");

const img1 = ref<string>();
const img2 = ref<string>();
const img3 = ref<string>();
const isMouseOver = ref(false); // Track mouse hover state
// Define maximum movement values (adjust these values according to your preference)
const maxMoveX = 5;
const maxMoveY = 2;
function onMousemove(e: MouseEvent) {
  const container = e.currentTarget as HTMLDivElement;
  // Calculate the percentage of mouse position within the container
  const mouseX = (e.clientX - container.offsetLeft) / container.clientWidth;
  const mouseY = (e.clientY - container.offsetTop) / container.clientHeight;
  // Calculate the movement values within the specified range
  const moveX = mouseX * 2 * maxMoveX - maxMoveX;
  const moveY = mouseY * 2 * maxMoveY - maxMoveY;
  // Apply the movement to the images
  img1.value = `translate(${moveX * 3.3}px, ${moveY * 0.6}px)`;
  img2.value = `translate(${moveX * 1.5}px, ${moveY * 2.8}px)`;
  img3.value = `translate(${moveX * 0.5}px, ${moveY * 4.1}px)`;
}
function onMouseleave(e: MouseEvent) {
  isMouseOver.value = true;
  // Apply the movement to the images
  img1.value = `translate(0px, 0px)`;
  img2.value = `translate(0px, 0px)`;
  img3.value = `translate(0px, 0px)`;
  setTimeout(() => (isMouseOver.value = false), 700);
}
</script>

<template>
  <div class="page">
    <section class="relative">
      <div
        class="relative z-20 mx-auto flex h-screen max-w-screen-xl items-center justify-center px-4 py-28 md_h-screen md_py-48"
      >
        <div class="relative z-20 md_basis-1/2">
          <h1 class="mb-2 text-4xl font-extrabold text-black drop-shadow-lg md_text-7xl md_leading-[4.8rem]">
            {{ $t("home.header.title") }}
          </h1>
          <p class="mb-4 font-light text-grey-300 md_mb-6 md_text-lg md_leading-10 md_tracking-[8px]">
            {{ $t("home.header.description") }}
          </p>
          <NuxtLink
            class="mb-3 mr-3 inline-flex justify-center rounded bg-primary-100 px-5 py-3 text-center text-base font-medium uppercase text-white hover_bg-primary-200"
            to="/reservation"
            >{{ $t("home.header.btn1") }}
          </NuxtLink>
          <NuxtLink
            class="inline-flex justify-center rounded border border-primary-100 px-5 py-3 text-center text-base font-medium uppercase text-primary-100 hover_bg-primary-100/10"
            to="/admin"
            >{{ $t("home.header.btn2") }}
          </NuxtLink>
        </div>

        <div class="relative hidden h-full md_block md_basis-1/2" @mousemove="onMousemove" @mouseleave="onMouseleave">
          <NuxtImg
            :style="{ transform: img1 }"
            loading="lazy"
            placeholder
            class="absolute -left-2 -top-20 rounded-sm drop-shadow-lg transition-transform duration-100"
            :class="{ 'duration-700': isMouseOver }"
            src="/images/header-plate3.webp"
            width="288px"
          />
          <NuxtImg
            :style="{ transform: img2 }"
            loading="lazy"
            placeholder
            class="absolute right-0 top-20 rounded-sm drop-shadow-lg transition-transform duration-100"
            :class="{ 'duration-700': isMouseOver }"
            src="/images/header-plate2.webp"
            width="330px"
          />
          <NuxtImg
            :style="{ transform: img3 }"
            loading="lazy"
            placeholder
            class="absolute -bottom-20 left-32 rounded-sm drop-shadow-lg transition-transform duration-100"
            :class="{ 'duration-700': isMouseOver }"
            src="/images/header-plate1.webp"
            width="400px"
          />
        </div>
      </div>
      <div
        class="absolute inset-y-0 right-0 z-0 h-full w-full bg-primary-200 opacity-20 [clip-path:polygon(100%_0%,40%_100%,0%_100%,120%_-10%)] [shape-outside:polygon(100%_0%,40%_100%,0%_100%,120%_-10%)] md_w-3/5 md_bg-black md_opacity-100 md_[clip-path:polygon(100%_0%,100%_100%,40%_100%,0%_0%)] md_[shape-outside:polygon(100%_0%,100%_100%,50%_100%,0%_0%)]"
      ></div>
    </section>

    <section class="bg-slate-200 px-4 py-20" id="how">
      <div class="mx-auto max-w-screen-md text-center">
        <h2 class="text-4xl font-semibold text-black">Come funziona il sito</h2>
        <p class="mt-3 text-grey-200">
          Commodo ea voluptate est laborum nisi nisi deserunt. Nulla commodo ipsum adipisicing consectetur dolore consectetur.
          Labore in magna adipisicing duis anim sunt ullamco nostrud.
        </p>

        <div class="mt-8">
          <iframe
            class="mx-auto"
            width="560"
            height="315"
            src="https://www.youtube.com/embed/nJTsbZojero?si=GVI_Sulfv93ZyEHx"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
            allowfullscreen
          />
        </div>
      </div>
    </section>

    <section class="bg-slate-50 px-4 py-px" id="benefits">
      <div class="mx-auto my-20 max-w-screen-md text-center">
        <h2 class="text-4xl font-semibold text-black">{{ $t("home.section2.title") }}</h2>
        <p class="mt-3 text-grey-200">{{ $t("home.section2.description") }}</p>
      </div>

      <div class="mx-auto my-20 flex max-w-screen-lg flex-col gap-4 md_flex-row md_gap-12">
        <div class="relative order-1 mt-4 md_order-none md_mt-auto md_basis-3/6">
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
          <!-- <p class="text-md text-primary-200">{{ $t("home.benefit1.subtitle") }}</p> -->
          <p class="mt-2 font-light text-grey-200">{{ $t("home.benefit1.description") }}</p>
        </div>
      </div>

      <div class="mx-auto my-24 flex max-w-screen-lg flex-col gap-4 md_flex-row md_gap-12">
        <div class="md_mt-14 md_basis-3/6">
          <h3 class="text-2xl font-semibold text-black">{{ $t("home.benefit2.title") }}</h3>
          <!-- <p class="text-md text-primary-200">{{ $t("home.benefit2.subtitle") }}</p> -->
          <p class="mt-2 font-light text-grey-200">{{ $t("home.benefit2.description") }}</p>
        </div>
        <div class="relative order-1 mt-4 md_order-none md_mt-auto md_basis-3/6">
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
        <div class="relative order-1 mt-4 md_order-none md_mt-auto md_basis-3/6">
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
          <!-- <p class="text-md text-primary-200">{{ $t("home.benefit3.subtitle") }}</p> -->
          <p class="mt-2 font-light text-grey-200">{{ $t("home.benefit3.description") }}</p>
        </div>
      </div>

      <div class="mx-auto my-24 flex max-w-screen-lg flex-col gap-4 md_flex-row md_gap-12">
        <div class="md_mt-14 md_basis-3/6">
          <h3 class="text-2xl font-semibold text-black">{{ $t("home.benefit4.title") }}</h3>
          <p class="text-md text-primary-200">{{ $t("home.benefit4.subtitle") }}</p>
          <p class="mt-2 font-light text-grey-200">{{ $t("home.benefit4.description") }}</p>
        </div>
        <div class="relative order-1 mt-4 md_order-none md_mt-auto md_basis-3/6">
          <div class="absolute -left-5 -top-5 flex h-20 w-20 items-center justify-center rounded-full bg-rose-400 text-white">
            <SVGIcon svg="charts" :size="36" />
          </div>
          <NuxtImg class="presentation-img" loading="lazy" placeholder src="/images/meta-google-analytics.jpg" width="500px" />
        </div>
      </div>

      <div class="mx-auto my-24 flex max-w-screen-lg flex-col gap-4 md_flex-row md_gap-12">
        <div class="relative order-1 mt-4 md_order-none md_mt-auto md_basis-3/6">
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
  </div>
</template>

<style lang="sass" scoped>
.presentation-img
  @apply shadow-lg shadow-slate-200
</style>
