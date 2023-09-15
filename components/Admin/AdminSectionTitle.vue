<script setup lang="ts">
interface Props {
  title: string;
  subtitle?: string;
  marginTop?: string;
  marginBottom?: string;
}

const props = withDefaults(defineProps<Props>(), {
  marginTop: "md_mt-1",
  marginBottom: "mb-8",
});
</script>

<template>
  <div :class="[marginTop, marginBottom]">
    <h3 class="text-lg text-grey-300">{{ title }}</h3>
    <p class="text-sm font-light text-grey-100" v-html="subtitle"></p>
  </div>
</template>
