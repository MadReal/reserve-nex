<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'empty-restaurants-list'], layout: 'admin-default' })

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
async function deleteDiscountAmount(discountAmountId: number) {
    await storeDiscounts.deleteDiscountAmount(discountAmountId)
    newDiscountAmountError.value = false
    newDiscountAmount.value = null
}
async function addDiscount(discountAmount: DiscountAmount, workTime: WorkTime) {
    // @ts-ignore
    await storeDiscounts.addDiscount(selectedDayOfWeek.value, discountAmount, workTime)
}

// drag shit
const dragHasLelt = ref(false)

// const startDrag = (event: any, discountAmountId: DiscountAmount["id"], effectAllowed: string) => {
//     console.log(event);
//     event.dataTransfer.effectAllowed = effectAllowed
//     event.dataTransfer.setData('discountAmountId', discountAmountId)
//     event.dataTransfer.setData('discountId', discountAmountId)
// }
const startDrag = (event: any, discountId: Discount["id"], discountAmountId: DiscountAmount["id"], effectAllowed: string) => {
    console.log(event);
    event.dataTransfer.effectAllowed = effectAllowed
    event.dataTransfer.setData('discountId', discountId)
    event.dataTransfer.setData('discountAmountId', discountAmountId)
}
const dragOver = (event: any) => {
    // console.log('dragOver');
    // console.log(event);
}
const enterDrag = (event: any) => {
    // console.log('enterDrag');
}
const leaveDrag = () => dragHasLelt.value = true
const endDrag = (event: any, discountId: Discount["id"]) => {
    if (dragHasLelt.value) {
        console.log('deleteDiscount');
        storeDiscounts.deleteDiscount(discountId)
    }
    console.log('endDrag');
}
const onDrop = (event: any, workTimeId: WorkTime["id"]) => {
    dragHasLelt.value = false
    const effectAllowed = event.dataTransfer.effectAllowed
    const discountId = parseInt(event.dataTransfer.getData('discountId'))
    const discountAmountId = parseInt(event.dataTransfer.getData('discountAmountId'))

    console.log('onDrop');
    console.log('workTimeId ' + workTimeId);
    console.log('discountId ' + discountId);
    console.log('discountAmountId ' + discountAmountId);
    console.log('************************');

    if (effectAllowed === 'copy' && !discountId) storeDiscounts.addDiscount(selectedDayOfWeek.value, workTimeId, discountAmountId)
    else if (effectAllowed === 'move' && discountId) storeDiscounts.updateDiscount(discountId, workTimeId, discountAmountId)
}
</script>


<template lang="pug">
.admin-page
    AdminPageTitle(title="Gestione Orari")

    //- AdminNoData(v-if="noData", text="Aggiungi orari di apertura prima di poter vedere le prenotazioni.", buttonText="Aggiungi Orari", linkPath="edit-time-open")
    .grid(class="grid-rows-[1fr_1px] lg_grid-rows-none lg_grid-cols-[4fr_1px_1fr]")
        div
            p.mt-1.mb-2.text-sm.text-grey-200 Seleziona giorno:
            .flex.items-center.pb-6.gap-2.border-b
                .py-1.px-2.text-black.text-sm.border.rounded-md.hover_border-grey-200.cursor-pointer(v-for="dayInt in 7", :key="dayInt", 
                    :class="{ 'border border-primary-100 text-primary-100 bg-primary-100/10' : selectedDayOfWeek === dayInt }"
                    @click="selectedDayOfWeek = dayInt") {{ useTranslateDayOfWeek(dayInt) }}


            .grid.gap-8.lg_gap-6.lg_border-b(class="grid-rows-[1fr_1px_1fr] lg_grid-rows-none lg_grid-cols-[1fr_1px_1fr]")
                div.lg_py-6
                    p.mb-4 Pranzo
                    .grid.grid-cols-3.lg_grid-cols-4.gap-2
                        .pt-3.text-grey-200.rounded.bg-grey-300.flex.items-center.justify-between.flex-col.text-white.overflow-hidden(class="min-h-[5rem]",
                            v-for="workTime in lunchWorkTimesList", :key="workTime.id")
                            .flex.items-center.justify-center
                                .mr-1: SVGIcon(svg="clock", :size="14")
                                p {{ workTime.time }}

                            .relative.h-8.w-full.overflow-hidden.flex.items-center.justify-center.group(
                                draggable="true",
                                @drop="onDrop($event, workTime.id)",
                                @dragstart="startDrag($event, discountOnWorkTime(workTime.id)?.id, discountOnWorkTime(workTime.id)?.discountAmount.id,  'move')"
                                @dragleave="leaveDrag()",
                                @dragend="endDrag($event, discountOnWorkTime(workTime.id)?.id)", 
                                @dragenter.prevent, @dragover.prevent)
                                p.w-full.h-full.bg-red-500.text-white.text-sm.text-center.cursor-grab.bg-red-500.text-white(
                                    :class="{ 'bg-transparent' : !discountOnWorkTime(workTime.id) }"
                                ) {{ discountOnWorkTime(workTime.id)?.discountAmount?.value }}{{ discountOnWorkTime(workTime.id)?.discountAmount?.value ? '%' : '-' }}

                .border-b.lg_border-r.lg_border-b-0

                //- div.lg_py-6
                //-     p.mb-4 Cena
                //-     .grid.grid-cols-3.lg_grid-cols-4.gap-2
                //-         AdminBoxDiscountDraggableNew(v-for="workTime in dinnerWorkTimesList", :key="workTime.id", :selectedDayOfWeek="selectedDayOfWeek", :workTime="workTime", @addDiscount="addDiscount")


        .border-b.lg_border-r.lg_border-b-0

        div.pl-6.mt-1.lg_mb-6
            p Sconti
            p.text-xs.text-grey-100.mb-4 Aggiungi nuovi sconti e trascinali nell'ora che desideri.

            .grid.grid-cols-2.gap-2
                .relative.rounded.bg-red-500.text-white.text-sm.text-center.cursor-grab.group.overflow-hidden(v-for="discountAmount in discountAmountsListOrdered", :key="discountAmount.id")
                    AdminDiscountDrag(:discountAmount="discountAmount", :showTrash="true"
                        draggable="true",
                        @dragstart="startDrag($event, null, discountAmount.id, 'copy')"
                        @dragenter.prevent, @dragover.prevent)

                input(v-model.number="newDiscountAmount", v-number="number", placeholder="40%", type="text", pattern="[0-9]*", maxlength="4"
                    class="h-7 p-1 text-sm text-center rounded border border-dashed border-grey-200 \
                    placeholder_text-grey-100 focus_border-solid focus_text-black focus_border-black focus_placeholder_text-grey-100 focus_outline-none",
                    :class="{ 'input--error': newDiscountAmountError }", @keyup.enter="addDiscountAmount", @input="validateInput")
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