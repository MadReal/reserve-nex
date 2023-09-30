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
            class="mr-3 inline-flex justify-center rounded bg-primary-100 px-5 py-3 text-center text-base font-medium uppercase text-white hover_bg-primary-200"
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
        <h2 class="mb-2 text-4xl font-semibold text-black">Come funziona il sito</h2>
        <p class="text-grey-200">
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
        <h2 class="mb-2 text-4xl font-semibold text-black">Vantaggi</h2>
        <p class="text-grey-200">
          Commodo ea voluptate est laborum nisi nisi deserunt. Nulla commodo ipsum adipisicing consectetur dolore consectetur.
          Labore in magna adipisicing duis anim sunt ullamco nostrud.
        </p>
      </div>

      <div class="mx-auto my-20 flex max-w-screen-lg gap-12">
        <div class="basis-3/6">
          <NuxtImg class="presentation-img" loading="lazy" placeholder src="/images/admin-dashboard1.webp" width="500px" />
        </div>
        <div class="mt-14 basis-3/6">
          <h2 class="mb-2 text-2xl font-semibold text-black">Gestisci le prenotazioni del tuo ristorante</h2>
          <h2 class="text-md mb-2 text-primary-200">Monitora i tuoi risultati grazie ai dati tracciati nel sito</h2>
          <p class="font-light text-grey-200">
            Aliqua consequat qui occaecat minim enim incididunt. Qui aute commodo labore amet fugiat fugiat ipsum minim ullamco
            dolore enim. Nulla ea mollit velit non dolor non labore deserunt dolor labore ex duis. Dolore in nostrud aliqua minim
            ex. Non minim consequat quis laboris labore.
          </p>
        </div>
      </div>

      <div class="mx-auto my-24 flex max-w-screen-lg gap-12">
        <div class="mt-14 basis-3/6">
          <h2 class="text-2xl font-semibold text-black">Più ristoranti, senza limiti e autonomamente</h2>
          <h2 class="text-md mb-2 text-primary-200">Monitora i tuoi risultati grazie ai dati tracciati nel sito</h2>
          <p class="font-light text-grey-200">
            Est nulla adipisicing qui non veniam dolore ullamco cillum commodo eu sit. Quis duis magna sunt non non ullamco mollit
            eiusmod qui proident nulla ipsum proident. Incididunt exercitation ad ullamco elit consequat fugiat qui dolore
            reprehenderit ut. Ad irure nisi magna ad consequat labore.
          </p>
        </div>
        <div class="basis-3/6">
          <NuxtImg class="presentation-img" loading="lazy" placeholder src="/images/admin-dashboard1.webp" width="500px" />
        </div>
      </div>

      <div class="mx-auto my-24 flex max-w-screen-lg gap-12">
        <div class="basis-3/6">
          <NuxtImg class="presentation-img" loading="lazy" placeholder src="/images/admin-dashboard3.webp" width="500px" />
        </div>
        <div class="mt-14 basis-3/6">
          <h2 class="text-2xl font-semibold text-black">Attrai i clienti con sconti accativanti</h2>
          <h2 class="text-md mb-2 text-primary-200">Monitora i tuoi risultati grazie ai dati tracciati nel sito</h2>
          <p class="font-light text-grey-200">
            L'installazione di Meta Pixel e Google Analytics consente di monitorare attentamente l'attività dei visitatori sul
            sito web. Questo fornisce dati preziosi per ottimizzare le campagne pubblicitarie, raggiungendo il pubblico giusto in
            modo più efficiente e riducendo i costi pubblicitari. In sintesi, questi strumenti consentono di prendere decisioni
            informate basate su dati concreti per migliorare le performance online.
          </p>
        </div>
      </div>

      <div class="mx-auto my-24 flex max-w-screen-lg gap-12">
        <div class="mt-14 basis-3/6">
          <h2 class="text-2xl font-semibold text-black">Ottimizza i tuoi investimenti</h2>
          <h2 class="text-md mb-2 text-primary-200">Monitora i tuoi risultati grazie ai dati tracciati nel sito</h2>
          <p class="font-light text-grey-200">
            L'installazione di Meta Pixel e Google Analytics consente di monitorare attentamente l'attività dei visitatori sul
            sito web. Questo fornisce dati preziosi per ottimizzare le campagne pubblicitarie, raggiungendo il pubblico giusto in
            modo più efficiente e riducendo i costi pubblicitari. In sintesi, questi strumenti consentono di prendere decisioni
            informate basate su dati concreti per migliorare le performance online.
          </p>
        </div>
        <div class="basis-3/6">
          <NuxtImg class="presentation-img" loading="lazy" placeholder src="/images/online-campaign-tracking.jpg" width="500px" />
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="sass" scoped>
.presentation-img
  @apply shadow-lg shadow-slate-200
</style>
