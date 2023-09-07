<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'empty-restaurants-list'], layout: 'admin-default' })
useHead({ title: 'Gestione Sconti', })

import { directive as VNumber } from '@coders-tm/vue-number-format'
const number = { suffix: '% ', precision: 2, max: 99 }

import { storeToRefs } from 'pinia'
import { useWorkTimesStore } from '~/stores/WorkTimes'
import { useDiscountsStore } from '~/stores/Discounts'

const storeWorkTimes = useWorkTimesStore();
const { lunchWorkTimesList, dinnerWorkTimesList } = storeToRefs(storeWorkTimes)

const storeDiscounts = useDiscountsStore();
storeDiscounts.fetchDiscountAmounts()
storeDiscounts.fetchDiscounts()
const { discountAmountsListOrdered, discountsList } = storeToRefs(storeDiscounts)

const noData = computed(() => (!storeWorkTimes.lunchWorkTimesList.length && !storeWorkTimes.dinnerWorkTimesList.length))

const selectedDayOfWeek = ref(1)
let newDiscountAmount = ref()
const newDiscountAmountError = ref(false)

const discountOnWorkTime = (workTimeId: WorkTime["id"]) => {
    return discountsList.value.find(item => item.dayOfWeek === selectedDayOfWeek.value && item.workTime.id === workTimeId)
}

function validateInput() {
    if (isNaN(newDiscountAmount.value)) newDiscountAmountError.value = true
    else newDiscountAmountError.value = false;
}
async function addDiscountAmount() {
    const alreadyPresent = discountAmountsListOrdered.value.some((e) => e.value === newDiscountAmount.value);
    if (alreadyPresent) newDiscountAmountError.value = true
    else {
        await storeDiscounts.addDiscountAmount(newDiscountAmount.value)
        newDiscountAmountError.value = false
    }
    newDiscountAmount.value = null
}
async function deleteDiscountAmount(discountAmountId: DiscountAmount["id"]) {
    await storeDiscounts.deleteDiscountAmount(discountAmountId)
    // window.location.reload()
    newDiscountAmountError.value = false
    newDiscountAmount.value = null
}
const deleteDiscount = (discountId: Discount["id"]) => {
    storeDiscounts.deleteDiscount(discountId)
}
const deleteAllDiscountsOnDayOfWeek = async (selectedDayOfWeek: number) => {
    const sentence = selectedDayOfWeek === 10 ? 'Sicuro di voler eliminare tutti gli sconti impostati?' : `Sicuro di voler eliminare gli sconti di ${useTranslateDayOfWeek(selectedDayOfWeek)}?`
    if (confirm(sentence)) {
        await storeDiscounts.deleteAllDiscountsOnDayOfWeek(selectedDayOfWeek)
    }
}


const startDrag = (event: any, discountId: Discount["id"], discountAmountId: DiscountAmount["id"], effectAllowed: string) => {
    event.dataTransfer.effectAllowed = effectAllowed
    event.dataTransfer.dropEffect = effectAllowed
    event.dataTransfer.setData('discountId', discountId)
    event.dataTransfer.setData('discountAmountId', discountAmountId)
}
const onDrop = (event: any) => {
    const discountAmountId = parseInt(event.dataTransfer.getData('discountAmountId'))
    storeDiscounts.addManyDiscounts(selectedDayOfWeek.value, discountAmountId)
}

</script>


<template lang="pug">
.admin-page
    AdminPageTitle(title="Gestione Sconti")
    AdminNoData(v-if="noData", text="Aggiungi orari di apertura prima di poter vedere le prenotazioni.", buttonText="Aggiungi Orari", linkPath="edit-time-open")

    .grid(class="grid-rows-[1fr_1px] md_grid-rows-none md_grid-cols-[4fr_1px_1fr]", v-else)
        div
            p.mt-1.mb-2.text-sm.text-grey-200 Seleziona giorno:
            .flex.items-center.flex-wrap.pb-6.gap-2.border-b.mb-6.md_mb-0
                .py-1.px-2.text-black.text-sm.border.rounded-md.hover_border-grey-200.cursor-pointer(v-for="dayInt in 7", :key="dayInt", 
                    :class="{ 'border border-primary-100 text-primary-100 bg-primary-100/10' : selectedDayOfWeek === dayInt }"
                    @click="selectedDayOfWeek = dayInt") {{ useTranslateDayOfWeek(dayInt) }}
                //- .py-1.px-2.text-orange-500.text-sm.border.border-orange-200.rounded-md.hover_border-orange-500.cursor-pointer(:class="{ '!border-orange-500 bg-orange-500/10' : selectedDayOfWeek === 10 }"
                //-     @click="selectedDayOfWeek = 10") Tutti i Giorni

            AdminContainerGrid2ColsBorder
                .md_py-6
                    p.mb-4.mt-1 Pranzo

                    AdminContainerGrid4Cols
                        AdminDiscountBox(v-for="workTime in lunchWorkTimesList", :key="workTime.id", :workTime="workTime", :selectedDayOfWeek="selectedDayOfWeek")

                AdminContainerDivider

                .md_py-6
                    p.mb-4.mt-1 Cena
                    AdminContainerGrid4Cols
                        AdminDiscountBox(v-for="workTime in dinnerWorkTimesList", :key="workTime.id", :workTime="workTime", :selectedDayOfWeek="selectedDayOfWeek")

            .w-full.my-8.pt-6.inline-flex.gap-3.border-t.md_my-6.md_pt-0.md_border-t-0
                button.w-fit.p-2.border.border-grey-200.rounded.text-xs.text-center.text-grey-200.cursor-pointer.hover_bg-grey-200.hover_text-white(@click="deleteAllDiscountsOnDayOfWeek(selectedDayOfWeek)") Reset giorno
                button.w-fit.p-2.border.border-red-400.rounded.text-xs.text-center.text-red-400.cursor-pointer.hover_bg-red-300.hover_text-red-700(@click="deleteAllDiscountsOnDayOfWeek(10)") Reset Tutto

        AdminContainerDivider.hidden.md_block

        .my-6.md_pl-6.md_mb-6.md_mt-1
            p Sconti
            p.text-sm.text-grey-100.mb-4 Aggiungi nuovi sconti e trascinali nell'ora che desideri.

            .grid.grid-cols-2.gap-2
                AdminDiscountAmount.rounded(v-for="discountAmount in discountAmountsListOrdered", :key="discountAmount.id", 
                    :value="discountAmount.value", isTrash, 
                    @updateOrDelete="deleteDiscountAmount(discountAmount.id)", 
                    @dragstart="startDrag($event, null, discountAmount.id, 'copy')")

                input(v-model.number="newDiscountAmount", v-number="number", placeholder="40%", type="text", pattern="[0-9]*", maxlength="4"
                    class="h-8 p-1 text-sm text-center rounded border border-dashed border-grey-200 \
                    placeholder_text-grey-100 focus_border-solid focus_text-black focus_border-black focus_placeholder_text-grey-100 focus_outline-none",
                    :class="{ 'input--error': newDiscountAmountError }", @keyup.enter="addDiscountAmount", @input="validateInput")

            .my-6.border-b

            .py-5.px-3.bg-red-50.border.border-dashed.border-red-300.rounded.text-xs.text-center.text-red-300(
                @drop="onDrop($event)", @dragenter.prevent, @dragover.prevent) Trascina per applicare sconto a tutti gli orari del giorno selezionato
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
    animation-duration: .6s;
    animation-timing-function: ease-in-out;
}
</style>