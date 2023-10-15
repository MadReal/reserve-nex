<script setup lang="ts">
import { storeToRefs } from "pinia";
import { directive as VNumber } from "@coders-tm/vue-number-format";
const i18n = useI18n();

definePageMeta({ middleware: ["auth", "empty-restaurants-list"], layout: "admin-default" });
useHead({ title: i18n.t("admin.discounts.page_name") });

const number = { suffix: "% ", precision: 2, max: 99 };

const storeWorkTimes = useWorkTimesStore();
const { lunchWorkTimesList, dinnerWorkTimesList } = storeToRefs(storeWorkTimes);

const storeDiscounts = useDiscountsStore();
storeDiscounts.fetchDiscountAmounts();
storeDiscounts.fetchDiscounts();
const { discountAmountsListOrdered } = storeToRefs(storeDiscounts);

const noData = computed(() => !storeWorkTimes.lunchWorkTimesList.length && !storeWorkTimes.dinnerWorkTimesList.length);

const selectedDayOfWeek = ref(1);
let newDiscountAmount = ref();
const newDiscountAmountError = ref(false);

function validateInput() {
  if (isNaN(newDiscountAmount.value)) newDiscountAmountError.value = true;
  else newDiscountAmountError.value = false;
}
async function addDiscountAmount() {
  const alreadyPresent = discountAmountsListOrdered.value.some((e) => e.value === newDiscountAmount.value);
  if (alreadyPresent || newDiscountAmount.value === 0) newDiscountAmountError.value = true;
  else {
    await storeDiscounts.addDiscountAmount(newDiscountAmount.value);
    newDiscountAmountError.value = false;
  }
  newDiscountAmount.value = null;
}
async function deleteDiscountAmount(discountAmountId: DiscountAmount["id"]) {
  await storeDiscounts.deleteDiscountAmount(discountAmountId);
  newDiscountAmountError.value = false;
  newDiscountAmount.value = null;
}

const startDrag = (event: any, discountAmountId: DiscountAmount["id"], effectAllowed: string) => {
  event.dataTransfer.effectAllowed = effectAllowed;
  event.dataTransfer.dropEffect = effectAllowed;
  event.dataTransfer.setData("discountAmountId", discountAmountId);
};
const onDrop = (event: any) => {
  const discountAmountId = parseInt(event.dataTransfer.getData("discountAmountId"));
  // drags on 1 DAY - ALL TIME || ALL DAYS - 1 TIME
  storeDiscounts.addManyDiscounts(selectedDayOfWeek.value, discountAmountId);
};
</script>

<template>
  <div class="page__content">
    <AdminPageTitle :title="$t('admin.discounts.page_name')" />
    <AdminNoData
      v-if="noData"
      text="Aggiungi orari di apertura prima di poter creare e applicare sconti."
      buttonText="Aggiungi Orari"
      linkPath="work-hours"
    />
    <div class="grid grid-rows-[1fr_1px] md_grid-cols-[4fr_1px_1fr] md_grid-rows-none" v-else>
      <div>
        <p class="mb-2 mt-1 text-sm text-grey-200">{{ $t("admin.discounts.select_day") }}:</p>
        <div class="mb-6 flex flex-wrap items-center gap-2 border-b pb-6 md_mb-0">
          <div
            class="cursor-pointer rounded-md border px-2 py-1 text-sm text-black hover_border-grey-200"
            v-for="dayInt in 7"
            :key="dayInt"
            :class="{ 'border border-primary-100 bg-primary-100/10 text-primary-100': selectedDayOfWeek === dayInt }"
            @click="selectedDayOfWeek = dayInt"
          >
            {{ useTranslateDayOfWeek(dayInt) }}
          </div>
          <div
            class="cursor-pointer rounded-md border border-orange-200 px-2 py-1 text-sm text-orange-500 hover_border-orange-500"
            :class="{ '!border-orange-500 bg-orange-500/10': selectedDayOfWeek === 10 }"
            @click="selectedDayOfWeek = 10"
          >
            {{ useTranslateDayOfWeek(10) }}
          </div>
        </div>

        <AdminContainerGrid2ColsBorder class="md_pr-6">
          <div class="md_py-6">
            <p class="mb-4 mt-1 capitalize">{{ $t("lunch") }}</p>
            <AdminContainerGrid4Cols>
              <AdminBoxDiscount
                v-for="workTime in lunchWorkTimesList"
                :key="workTime.id"
                :workTime="workTime"
                :selectedDayOfWeek="selectedDayOfWeek"
              />
            </AdminContainerGrid4Cols>
          </div>

          <AdminContainerDivider />

          <div class="md_py-6">
            <p class="mb-4 mt-1 capitalize">{{ $t("dinner") }}</p>
            <AdminContainerGrid4Cols>
              <AdminBoxDiscount
                v-for="workTime in dinnerWorkTimesList"
                :key="workTime.id"
                :workTime="workTime"
                :selectedDayOfWeek="selectedDayOfWeek"
              />
            </AdminContainerGrid4Cols>
          </div>
        </AdminContainerGrid2ColsBorder>

        <AdminDiscountsDelete :selectedDayOfWeek="selectedDayOfWeek" />
      </div>

      <AdminContainerDivider class="hidden md_block" />

      <div class="my-6 h-max md_mb-6 md_mt-1 md_pl-6">
        <p>{{ $t("admin.discounts.discount_title") }}</p>
        <p class="mb-4 text-sm text-grey-100">{{ $t("admin.discounts.discount_description") }}</p>
        <div class="grid grid-cols-2 gap-2">
          <AdminDiscountAmount
            class="rounded"
            v-for="discountAmount in discountAmountsListOrdered"
            :key="discountAmount.id"
            :value="discountAmount.value"
            isTrash
            @updateOrDelete="deleteDiscountAmount(discountAmount.id)"
            @dragstart="startDrag($event, discountAmount.id, 'copy')"
          />

          <input
            class="h-8 rounded border border-dashed border-grey-200 p-1 text-center text-sm placeholder_text-grey-100 focus_border-solid focus_border-black focus_text-black focus_outline-none focus_placeholder_text-grey-100"
            v-model.number="newDiscountAmount"
            v-number="number"
            placeholder="40%"
            type="text"
            pattern="[0-9]*"
            maxlength="4"
            :class="{ 'input--error': newDiscountAmountError }"
            @keyup.enter="addDiscountAmount"
            @input="validateInput"
          />
        </div>
        <div class="my-6 border-b"></div>
        <div
          class="mb-20 rounded border border-dashed border-red-300 bg-red-50 px-3 py-5 text-center text-xs text-red-300 md_mb-0"
          @drop="onDrop($event)"
          @dragenter.prevent
          @dragover.prevent
        >
          {{ $t("admin.discounts.discount_dropbox") }}
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes shakeError {
  0% {
    transform: translateX(0);
  }

  15% {
    transform: translateX(0.375rem);
  }

  30% {
    transform: translateX(-0.375rem);
  }

  45% {
    transform: translateX(0.375rem);
  }

  60% {
    transform: translateX(-0.375rem);
  }

  75% {
    transform: translateX(0.375rem);
  }

  90% {
    transform: translateX(-0.375rem);
  }

  100% {
    transform: translateX(0);
  }
}

.input--error {
  animation-name: shakeError;
  animation-fill-mode: forwards;
  animation-duration: 0.6s;
  animation-timing-function: ease-in-out;
}
</style>
