<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'empty-restaurants-list'], layout: 'admin-default' })
useHead({ title: 'Gestione Sconti', })

import { directive as VNumber } from '@coders-tm/vue-number-format'
const number = { suffix: '% ', precision: 2, max: 99 }

import { storeToRefs } from 'pinia'
import { useWorkTimesStore } from '~/stores/WorkTimes'
import { useDiscountsStore } from '~/stores/Discounts'

const storeWorkTimes = useWorkTimesStore();
storeWorkTimes.fetchWorkTimes()
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
    newDiscountAmountError.value = false
    newDiscountAmount.value = null
}
const deleteDiscount = (discountId: Discount["id"]) => {
    storeDiscounts.deleteDiscount(discountId)
}


const dragHasLelt = ref(false)
const startDrag = (event: any, discountId: Discount["id"], discountAmountId: DiscountAmount["id"], effectAllowed: string) => {
    event.dataTransfer.effectAllowed = effectAllowed
    event.dataTransfer.dropEffect = effectAllowed
    event.dataTransfer.setData('discountId', discountId)
    event.dataTransfer.setData('discountAmountId', discountAmountId)
}
const leaveDrag = () => dragHasLelt.value = true
const endDrag = (event: any, discountId: Discount["id"]) => dragHasLelt.value ? deleteDiscount(discountId) : null
const onDrop = (event: any, workTimeId: WorkTime["id"]) => {
    dragHasLelt.value = false
    const effectAllowed = event.dataTransfer.effectAllowed
    const discountId = parseInt(event.dataTransfer.getData('discountId'))
    const discountAmountId = parseInt(event.dataTransfer.getData('discountAmountId'))

    const discountToCheck = discountOnWorkTime(workTimeId)
    if (effectAllowed === 'copy') {
        // if you're adding a Discount on WorkTime
        if (!discountId && !discountToCheck) storeDiscounts.addDiscount(selectedDayOfWeek.value, workTimeId, discountAmountId)
        // if you're trying to replace a discountAmount in a workTime with Discount already set
        if (!discountId && discountToCheck) storeDiscounts.updateDiscount(discountToCheck.id, workTimeId, discountAmountId)
    } else if (effectAllowed === 'move') {
        storeDiscounts.updateDiscount(discountId, workTimeId, discountAmountId)
    }
}
</script>


<template lang="pug">
.admin-page
    AdminPageTitle(title="Gestione Sconti")
    AdminNoData(v-if="noData", text="Aggiungi orari di apertura prima di poter vedere le prenotazioni.", buttonText="Aggiungi Orari", linkPath="edit-time-open")

    .grid(class="grid-rows-[1fr_1px] lg_grid-rows-none lg_grid-cols-[4fr_1px_1fr]", v-else)
        div
            p.mt-1.mb-2.text-sm.text-grey-200 Seleziona giorno:
            .flex.items-center.pb-6.gap-2.border-b
                .py-1.px-2.text-black.text-sm.border.rounded-md.hover_border-grey-200.cursor-pointer(v-for="dayInt in 7", :key="dayInt", 
                    :class="{ 'border border-primary-100 text-primary-100 bg-primary-100/10' : selectedDayOfWeek === dayInt }"
                    @click="selectedDayOfWeek = dayInt") {{ useTranslateDayOfWeek(dayInt) }}
                .py-1.px-2.text-orange-500.text-sm.border.border-orange-200.rounded-md.hover_border-orange-500.cursor-pointer(:class="{ '!border-orange-500 bg-orange-500/10' : selectedDayOfWeek === 10 }"
                    @click="selectedDayOfWeek = 10") Tutti i Giorni


            AdminContainerGrid2ColsBorder
                .lg_py-6
                    p.mb-4.mt-1 Pranzo

                    AdminContainerGrid4Cols
                        AdminDiscountBox(v-for="workTime in lunchWorkTimesList", :key="workTime.id", :workTime="workTime", :selectedDayOfWeek="selectedDayOfWeek")

                AdminContainerDivider

                .lg_py-6
                    p.mb-4.mt-1 Cena
                    AdminContainerGrid4Cols
                        AdminDiscountBox(v-for="workTime in dinnerWorkTimesList", :key="workTime.id", :workTime="workTime", :selectedDayOfWeek="selectedDayOfWeek")

            button.w-fit.mt-3.p-2.border.border-grey-200.rounded.text-xs.text-center.text-grey-200.cursor-pointer.hover_bg-grey-200.hover_text-white Reset giorno

        AdminContainerDivider

        .pl-6.mt-1.lg_mb-6
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

            .py-3.px-1.bg-red-50.border.border-dashed.border-red-300.rounded.text-xs.text-center.text-red-200 Trascina per applicare a tutti gli orari
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