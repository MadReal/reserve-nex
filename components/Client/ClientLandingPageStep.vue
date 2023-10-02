<script setup lang="ts">
interface Props {
  step: string;
  text: string;
}
const props = defineProps<Props>();
</script>

<template>
  <div class="group">
    <div
      class="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-primary-100 p-3 group-hover_bg-primary-100/10"
    >
      <p class="text-xl">{{ step }}</p>
    </div>
    <p class="mt-2 text-sm font-medium text-grey-300">{{ text }}</p>
  </div>
</template>
