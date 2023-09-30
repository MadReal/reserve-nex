<script setup lang="ts">
interface Props {
  text: string;
  isColorPrimary?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  isColorPrimary: true,
});
const emit = defineEmits(["click"]);
</script>

<template>
  <div
    class="mb-2 flex cursor-pointer items-center justify-between rounded-lg border border-dashed px-3 py-2 capitalize hover_bg-slate-50"
    :class="{ 'border-primary-100': isColorPrimary, 'border-grey-100': !isColorPrimary }"
    @click="$emit('click')"
  >
    <p :class="['leading-normal', { 'text-primary-100': isColorPrimary, 'text-grey-300': !isColorPrimary }]">{{ text }}</p>
    <SVGIcon svg="plus" :size="15" :class="{ 'text-primary-100': isColorPrimary, 'text-grey-300': !isColorPrimary }" />
  </div>
</template>
