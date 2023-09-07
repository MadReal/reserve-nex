<script setup lang="ts">
// definePageMeta({ layout: false, })
useHead({ title: 'Ristorante', })
</script>


<template>
    <div class="page">
        <section class="relative">
            <div
                class="h-screen md_h-screen flex items-center justify-center max-w-screen-xl py-28 px-4 md_py-48 md_px-0 mx-auto relative z-20">
                <div class="md_basis-1/2 relative z-20">
                    <h1 class="text-black lg_leading-[5rem] mb-2 text-4xl font-extrabold lg_text-7xl">Rilassati in
                        un'atmosfera calda e raffinata</h1>
                    <p class="mb-4 md_mb-6 md_leading-10 md_tracking-[10px] font-light text-grey-300 md_text-lg lg_text-lg">
                        L'unione tra i migliori prodotti gastronomici del Mediterraneo e l'arte del sushi giapponese.</p>
                    <NuxtLink
                        class="uppercase justify-center inline-flex px-5 py-3 text-base font-medium text-center mr-3 text-white rounded bg-primary-100 hover_bg-primary-200"
                        to="/reservation">Prenota</NuxtLink>
                    <NuxtLink
                        class="uppercase justify-center inline-flex px-5 py-3 text-base font-medium text-center text-primary-100 rounded border border-primary-100 hover_bg-primary-100/10"
                        to="/admin">Vedi Admin</NuxtLink>
                </div>

                <div class="hidden md_block md_basis-1/2 h-full relative">
                    <NuxtImg class="absolute -top-20 -left-2 rounded-sm drop-shadow-lg" src="/images/header-plate3.jpg">
                    </NuxtImg>
                    <NuxtImg class="absolute top-20 right-0 rounded-sm drop-shadow-lg" src="/images/header-plate2.jpg">
                    </NuxtImg>
                    <NuxtImg class="absolute -bottom-20 left-32 rounded-sm drop-shadow-lg" src="/images/header-plate1.jpg">
                    </NuxtImg>
                </div>
            </div>
            <div class="w-full md_w-3/5 h-full absolute z-0 inset-y-0 right-0 bg-primary-200 md_bg-black
                [shape-outside:polygon(100%_0%,40%_100%,0%_100%,120%_-10%)]
                [clip-path:polygon(100%_0%,40%_100%,0%_100%,120%_-10%)]
                md_[shape-outside:polygon(100%_0%,100%_100%,50%_100%,0%_0%)]
                md_[clip-path:polygon(100%_0%,100%_100%,40%_100%,0%_0%)]
                opacity-20 md_opacity-100
                ">
            </div>
        </section>
    </div>
</template>
