<script setup lang="ts">
interface Props {
  value: number | null;
  isTrash?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  isTrash: false,
});
const emit = defineEmits(["updateOrDelete", "dragstart", "dragleave", "dragend"]);
</script>

<template>
  <div
    class="group relative z-10 flex h-8 w-full items-center justify-center overflow-hidden text-center text-sm text-white"
    :class="{ 'bg-transparent': !value, 'cursor-grab bg-red-500': value }"
    :draggable="value ? true : false"
    @dragstart="$emit('dragstart', $event)"
    @dragleave="$emit('dragleave', $event)"
    @dragend="$emit('dragend', $event)"
    @dragenter.prevent
    @dragover.prevent
  >
    <p :class="{ 'group-hover_mr-2': value }">{{ value }}{{ value ? "%" : "-" }}</p>

    <div
      v-if="value"
      class="absolute inset-y-0 right-0 z-10 hidden cursor-pointer items-center bg-error-300 px-1 hover_text-gray-200 group-hover_flex"
      @click="$emit('updateOrDelete')"
    >
      <SVGIcon :svg="isTrash ? 'trash' : 'close'" :size="14" />
    </div>
  </div>
</template>
