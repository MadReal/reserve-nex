<script setup lang="ts">
// definePageMeta({ layout: false, })
useHead({ title: "Ristorante" });

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
  setTimeout(() => {
    isMouseOver.value = false;
  }, 700);
}
</script>

<template>
  <div class="page">
    <section class="relative">
      <div
        class="relative z-20 mx-auto flex h-screen max-w-screen-xl items-center justify-center px-4 py-28 md_h-screen md_py-48"
      >
        <div class="relative z-20 md_basis-1/2">
          <h1 class="mb-2 text-4xl font-extrabold text-black md_text-7xl md_leading-[5rem]">
            Rilassati in un'atmosfera calda e raffinata
          </h1>
          <p class="mb-4 font-light text-grey-300 md_mb-6 md_text-lg md_leading-10 md_tracking-[10px]">
            L'unione tra i migliori prodotti gastronomici del Mediterraneo e l'arte del sushi giapponese.
          </p>
          <NuxtLink
            class="mr-3 inline-flex justify-center rounded bg-primary-100 px-5 py-3 text-center text-base font-medium uppercase text-white hover_bg-primary-200"
            to="/reservation"
            >Prenota</NuxtLink
          >
          <NuxtLink
            class="inline-flex justify-center rounded border border-primary-100 px-5 py-3 text-center text-base font-medium uppercase text-primary-100 hover_bg-primary-100/10"
            to="/admin"
            >Vedi Admin</NuxtLink
          >
        </div>

        <div class="relative hidden h-full md_block md_basis-1/2" @mousemove="onMousemove" @mouseleave="onMouseleave">
          <NuxtImg
            :style="{ transform: img1 }"
            fit="cover"
            loading="lazy"
            placeholder
            class="absolute -left-2 -top-20 rounded-sm drop-shadow-lg transition-transform duration-100"
            :class="{ 'duration-700': isMouseOver }"
            src="/images/header-plate3.webp"
            width="288px"
          >
          </NuxtImg>
          <NuxtImg
            :style="{ transform: img2 }"
            fit="cover"
            loading="lazy"
            placeholder
            class="absolute right-0 top-20 rounded-sm drop-shadow-lg transition-transform duration-100"
            :class="{ 'duration-700': isMouseOver }"
            src="/images/header-plate2.webp"
            width="330px"
          >
          </NuxtImg>
          <NuxtImg
            :style="{ transform: img3 }"
            fit="cover"
            loading="lazy"
            placeholder
            class="absolute -bottom-20 left-32 rounded-sm drop-shadow-lg transition-transform duration-100"
            :class="{ 'duration-700': isMouseOver }"
            src="/images/header-plate1.webp"
            width="400px"
          >
          </NuxtImg>
        </div>
      </div>
      <div
        class="absolute inset-y-0 right-0 z-0 h-full w-full bg-primary-200 opacity-20 [clip-path:polygon(100%_0%,40%_100%,0%_100%,120%_-10%)] [shape-outside:polygon(100%_0%,40%_100%,0%_100%,120%_-10%)] md_w-3/5 md_bg-black md_opacity-100 md_[clip-path:polygon(100%_0%,100%_100%,40%_100%,0%_0%)] md_[shape-outside:polygon(100%_0%,100%_100%,50%_100%,0%_0%)]"
      ></div>
    </section>
  </div>
</template>
