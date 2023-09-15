<script setup lang="ts">
interface AdminPageTitleProps {
  title: string;
  subtitle?: string;
  date?: string;
}
const props = defineProps<AdminPageTitleProps>();
</script>

<template>
  <div class="mb-10">
    <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
      <h1 class="text-2xl font-semibold text-black">{{ title }}</h1>
      <p class="-mb-1 font-light leading-7 text-grey-200" v-if="date">
        {{ `(${date})` }}
      </p>

      <slot />
    </div>
    <p class="mt-1 text-sm font-light text-grey-200 opacity-60" v-if="subtitle">
      {{ subtitle }}
    </p>
  </div>
</template>
