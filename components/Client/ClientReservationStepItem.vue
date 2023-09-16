<script setup lang="ts">
interface Props {
  stepNumber: number;
  activeStepNumber: number;
  icon: string;
}
const props = defineProps<Props>();
const emit = defineEmits(["click"]);

const isActiveStep = computed(() => props.stepNumber === props.activeStepNumber);
const isSurpassedStep = computed(() => props.activeStepNumber > props.stepNumber);

const classActiveStep =
  "after_bottom-0 after_absolute after_border-8 after_border-b-gray-300 after_border-t-transparent after_border-x-transparent";
const classClick = computed(() => (props.activeStepNumber === 4 ? "cursor-default" : "cursor-pointer"));
</script>

<template>
  <div
    class="z-10 mx-auto my-2 flex h-20 w-20 items-center justify-center md_my-6"
    :class="isActiveStep ? classActiveStep : ''"
    @click="$emit('click')"
  >
    <div
      class="rounded-full border bg-white p-3 md_p-5"
      :class="[{ 'border-primary-100': isActiveStep, 'border-grey-200': isSurpassedStep }, classClick]"
    >
      <SVGIcon
        :svg="icon"
        class="h-5 w-5 text-grey-100 md_h-7 md_w-7"
        :class="{ 'text-primary-100': isActiveStep, 'text-grey-200': isSurpassedStep }"
      />
    </div>
  </div>
</template>
