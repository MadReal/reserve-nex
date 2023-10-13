<template lang="pug">
component(:is="dynamicSvg", v-if="dynamicSvg", :width="size", :height="size")
</template>

<script setup lang="ts">
interface IconComponentProps {
  svg: string;
  color?: string;
  size?: number;
}

const props = withDefaults(defineProps<IconComponentProps>(), {
  color: "grey-100",
  size: 20,
});

let dynamicSvg = ref(null);

const importSvg = async (svgText: string) => {
  if (svgText) return await import(`~/assets/icons/${svgText}.svg`);
};

onMounted(async () => (dynamicSvg.value = await importSvg(props.svg)));
watch(
  () => props.svg,
  async (svgText) => (dynamicSvg.value = await importSvg(svgText)),
);
</script>
