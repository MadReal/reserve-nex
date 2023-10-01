<script setup lang="ts">
interface Props {
  hasScrolled?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  hasScrolled: false,
});

const routeName = computed(() => useRoute().name);
const { locale, setLocale } = useI18n();
const isIT = computed(() => locale.value === "it");

const isAdmin = computed(() => props.hasScrolled || routeName.value?.toString().includes("admin"));
const isNavTextWhite = computed(() => !isAdmin.value && !props.hasScrolled && routeName.value !== "reservation");
const isNavTextBlack = computed(() => isAdmin.value || props.hasScrolled || routeName.value === "reservation");
</script>

<template>
  <div
    class="ml-auto flex h-[30px] items-center self-center overflow-hidden rounded-md border md_h-7"
    :class="{ 'border-white/20 text-white': isNavTextWhite, 'border-black/20 text-black': isNavTextBlack }"
  >
    <div
      class="flex h-full min-w-[2rem] cursor-pointer items-center justify-center px-2 text-xs hover_text-primary-100"
      :class="{ 'bg-black/10': isIT && isNavTextBlack, 'bg-white/10': isIT && isNavTextWhite }"
      @click.prevent.stop="setLocale('it')"
    >
      <p>IT</p>
    </div>

    <div class="h-full w-px" :class="{ 'bg-white/20': isNavTextWhite, 'bg-black/20': isNavTextBlack }"></div>

    <div
      class="flex h-full min-w-[2rem] cursor-pointer items-center justify-center px-2 text-xs hover_text-primary-100"
      :class="{ 'bg-black/10': !isIT && isNavTextBlack, 'bg-white/10': !isIT && isNavTextWhite }"
      @click.prevent.stop="setLocale('en')"
    >
      <p>EN</p>
    </div>
  </div>
</template>

<style lang="sass" scoped></style>
