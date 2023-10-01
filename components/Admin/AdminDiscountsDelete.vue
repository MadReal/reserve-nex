<script setup lang="ts">
interface Props {
  selectedDayOfWeek: DayOfWeek;
}
const props = defineProps<Props>();

const { locale } = useI18n();
const isIT = computed(() => locale.value === "it");

const storeDiscounts = useDiscountsStore();

const deleteAllDiscountsOnDayOfWeek = async (selectedDayOfWeek: DayOfWeek) => {
  let sentence = "";

  if (isIT.value) {
    sentence =
      selectedDayOfWeek === 10
        ? "Sicuro di voler eliminare tutti gli sconti impostati?"
        : `Sicuro di voler eliminare gli sconti di questo giorno?`;
  } else {
    sentence =
      selectedDayOfWeek === 10
        ? "Are you sure you want to delete all the set discounts?"
        : "Are you sure you want to delete the discounts for this day?";
  }

  if (confirm(sentence)) await storeDiscounts.deleteAllDiscountsOnDayOfWeek(selectedDayOfWeek);
};
</script>

<template>
  <div class="my-8 inline-flex w-full gap-3 border-t pt-6 md_my-6 md_border-t-0 md_pt-0">
    <button
      :disabled="props.selectedDayOfWeek === 10"
      class="w-fit rounded border border-grey-200 p-2 text-center text-xs text-grey-200"
      :class="{
        'cursor-not-allowed opacity-20': props.selectedDayOfWeek === 10,
        'cursor-pointer hover_bg-grey-200 hover_text-white': props.selectedDayOfWeek !== 10,
      }"
      @click="deleteAllDiscountsOnDayOfWeek(props.selectedDayOfWeek)"
    >
      {{ $t("admin.discounts.btn_reset_day") }}
    </button>

    <button
      class="w-fit cursor-pointer rounded border border-red-400 p-2 text-center text-xs text-red-400 hover_bg-red-300 hover_text-red-700"
      @click="deleteAllDiscountsOnDayOfWeek(10)"
    >
      {{ $t("admin.discounts.btn_reset_all") }}
    </button>
  </div>
</template>
