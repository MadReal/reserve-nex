<script setup lang="ts">
interface NoDataProps {
    text: string
    buttonText?: string
    linkPath?: string
}
const props = defineProps<NoDataProps>()
</script>


<template lang="pug">
.flex.items-center.justify-center(class="h-4/6")
    .text-center
        p.text-xl.text-grey-100 {{ text }}
        .mt-6(v-if="buttonText && linkPath")
            NuxtLink.py-3.px-4.bg-grey-100.text-white.rounded-lg.transition-opacity.duration-200.hover_opacity-80(:to="{ path: `/admin/${linkPath}`}") {{ buttonText }}
</template>