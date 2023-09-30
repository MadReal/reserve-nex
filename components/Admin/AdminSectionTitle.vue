<script setup lang="ts">
interface Props {
  title: string;
  subtitle?: string;
  marginTop?: string;
  marginBottom?: string;
  subtitleSmallerWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  marginTop: "md_mt-1",
  marginBottom: "mb-8",
  subtitleSmallerWidth: false,
});
</script>

<template>
  <div :class="[marginBottom, marginTop]">
    <h3 class="text-lg text-grey-300">{{ title }}</h3>
    <p class="text-sm font-light text-grey-100" :class="{ 'md_w-9/12': subtitleSmallerWidth }">{{ subtitle }}</p>
  </div>
</template>
