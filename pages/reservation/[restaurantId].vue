<script setup lang="ts">
import { storeToRefs } from 'pinia';
const route = useRoute();
import { directive as VNumber } from '@coders-tm/vue-number-format'
const number = { suffix: '', precision: 13, separator: '' }


// route params
const restaurantIdParam = parseInt(route.params.restaurantId[0])
// logic to move between steps
const activeSectionStep = ref(1)
const activeSectionClass = 'after_bottom-0 after_absolute after_border-8 after_border-b-gray-300 after_border-t-transparent after_border-x-transparent'
const clickClass = computed(() => activeSectionStep.value === 4 ? 'cursor-default' : 'cursor-pointer')
const isActiveSectionStepBiggerThen = (number: number): boolean => (activeSectionStep.value > number)
const goToStep = (stepToGo: number) => {
    // if already finished, can't go back
    if (activeSectionStep.value === 4) return
    // always go to previous stepToGo
    if (stepToGo < activeSectionStep.value) activeSectionStep.value = stepToGo
    if (stepToGo === 3 && newReservation.value.time) activeSectionStep.value = stepToGo
}

// init reservation object
const newReservation = ref<Partial<Reservation>>({
    date: null!,
    time: '',
    discountAmount: null,
    personName: undefined,
    personEmail: undefined,
    personPhone: undefined,
    peopleAmount: 1,
    personInstagram: null,
    restaurantId: restaurantIdParam
})

// step 1
// ====================
import { useBlocksStore } from '~/stores/Blocks'
const storeBlocks = useBlocksStore()
const { blockedDatesListFullCalendar, blockedDaysOfWeekList } = storeToRefs(storeBlocks)
import { useRestaurantsStore } from '@/stores/Restaurants';
const storeRestaurants = useRestaurantsStore();
const { activeRestaurant } = storeToRefs(storeRestaurants)
storeRestaurants.fetchSingleRestaurant(restaurantIdParam);
//
const daysClosedSentence = computed(() => {
    const isActive = blockedDaysOfWeekList.value.length > 0
    const dayOrDaysWord = blockedDaysOfWeekList.value.length > 1 ? 'Giorni' : 'Giorno';
    const mainSentence = `${dayOrDaysWord} di chiusura: `
    const listOfDays = blockedDaysOfWeekList.value.map(item => useTranslateDayOfWeek(item.dayOfWeek!)).join(', ')
    return { isActive, mainSentence, listOfDays }
})
const hiddenDaysOfWeek = computed(() => blockedDaysOfWeekList.value.map(item => (item.dayOfWeek === 7 ? 0 : item.dayOfWeek)))
const blockedDates = computed(() => blockedDatesListFullCalendar.value.map(item => ({ ...item, display: 'background' })))


// step 2
// ====================
import { useWorkTimesStore } from '~/stores/WorkTimes'
const storeWorkTimes = useWorkTimesStore();
const { lunchWorkTimesList, dinnerWorkTimesList } = storeToRefs(storeWorkTimes)
import { useDiscountsStore } from '~/stores/Discounts'
const storeDiscounts = useDiscountsStore();
//
const selectReservationTimeAndDiscountAmount = (time: WorkTime["time"], discountAmount: number) => {
    newReservation.value.time = time
    newReservation.value.discountAmount = discountAmount
    activeSectionStep.value++
}

// step 3
// ====================
import { useReservationsStore } from '@/stores/Reservations';
const storeReservations = useReservationsStore();
// 
const isFormEmpty = computed(() => {
    const { id, time, date, restaurantId, discountAmount, personInstagram, ...otherDetails } = newReservation.value;
    return Object.values(otherDetails).some(value => value === '' || value === null || value === undefined);
});
const errorOnInput = ref({
    personEmail: false,
    personPhone: false,
})
function validateEmail(email: string | undefined) {
    if (email && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) return errorOnInput.value.personEmail = false
    else return errorOnInput.value.personEmail = true
}
function validatePhone(phoneNumber: number | undefined) {
    if (!phoneNumber || phoneNumber.toString().length < 8) return errorOnInput.value.personPhone = true
    else return errorOnInput.value.personPhone = false
}
async function addReservation() {
    // exit if there are any errors
    validateEmail(newReservation.value.personEmail)
    validatePhone(newReservation.value.personPhone)
    if (errorOnInput.value.personEmail || errorOnInput.value.personPhone) return

    const reservation = await storeReservations.addReservation(newReservation.value);
    // @ts-ignore
    newReservation.value = reservation
    activeSectionStep.value++
}

//************
// CALENDAR
//************
// https://github.com/fullcalendar/fullcalendar-vue
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dateClick(), to drag and create events
import itLocale from '@fullcalendar/core/locales/it';


const handleDateClick = (dateClickInfo: any) => {
    // Get the date as a string without the time
    const selectedDate = dateClickInfo.date
    const selectedDateFixed = new Date(dateClickInfo.dateStr)

    const currentDate = new Date(); // Get the current date and time
    currentDate.setUTCHours(0, 0, 0, 0); // Set the time component to midnight for comparison

    // Check if the selectedDate is inside the blockedDates array
    const isDateBlocked = blockedDates.value.some((blockedDate) => {
        // @ts-ignore
        const blockStartDate = new Date(blockedDate.dateStart);
        // @ts-ignore
        const blockEndDate = new Date(blockedDate.dateEnd);
        return selectedDateFixed >= blockStartDate && selectedDateFixed < blockEndDate;
    });

    //  if the selected date is before today's date or is inside blockedDates exit the function
    if (selectedDate < currentDate || isDateBlocked) return

    dateClickInfo.dayEl.style.backgroundColor = 'rgb(0 143 220 / 30%)';
    activeSectionStep.value++;

    let dayOfWeek = selectedDate.getDay()
    // adjust sunday, because it's 0 but 7 is app=s sunday
    dayOfWeek === 0 ? dayOfWeek = 7 : dayOfWeek = dayOfWeek

    newReservation.value.date = selectedDate;
    storeWorkTimes.fetchWorkTimes(restaurantIdParam);
    storeDiscounts.fetchDiscountsByDayOfWeek(dayOfWeek, restaurantIdParam)
}


const calendarOptions = ref({
    plugins: [dayGridPlugin, interactionPlugin],
    locale: itLocale,
    headerToolbar: { left: 'prev', center: 'title', right: 'next' },
    initialView: 'dayGridMonth',
    selectable: false,
    dayMaxEvents: true,
    contentHeight: 320,
    progressiveEventRendering: true,
    events: blockedDates,
    hiddenDays: hiddenDaysOfWeek,
    dateClick: handleDateClick
})

storeBlocks.fetchBlockedDaysOfWeek(restaurantIdParam)
storeBlocks.fetchBlockedDates(restaurantIdParam)
storeBlocks.fetchBlockedTimeRangeOnDate(restaurantIdParam)
</script>


<template lang="pug">
.page.relative.z-0.h-screen
    //- ClientBackground
    .fixed.inset-0.z-0.h-full.bg-cover(class="bg-[url('/images/jason-leung.webp')]")
        .w-full.h-full.flex.justify-center.items-center(class="bg-black/40 backdrop-brightness-50")


    section.max-w-screen-xl.mx-auto.px-4.pt-8.pb-20.md_pt-36
        .w-full.border.rounded-lg.mx-auto.min-h-min.overflow-hidden.shadow-xl.relative.z-10(class="md_w-6/12 shadow-[rgba(0,0,0,0.03)]")
            .grid.grid-cols-4.relative.border-b.bg-slate-50
                //- line in the background
                .mx-10.absolute.inset-x-0.inset-y-0.z-0
                    .absolute.border-b.w-full.h-1.inset-x-0(class="top-1/2")

                .flex.items-center.justify-center.w-20.h-20.mx-auto.my-2.md_my-6.z-10(:class="activeSectionStep === 1 ? activeSectionClass : ''", @click="goToStep(1)")
                    .p-3.md_p-5.rounded-full.border.bg-white(
                        :class="[{ 'border-primary-100' : activeSectionStep === 1, 'border-grey-200' : isActiveSectionStepBiggerThen(1)}, clickClass]")
                        SVGIcon.w-5.h-5.md_w-7.md_h-7.text-grey-100(svg="calendar", :class="{ 'text-primary-100' : activeSectionStep === 1, 'text-grey-200' : isActiveSectionStepBiggerThen(1) }")

                .flex.items-center.justify-center.w-20.h-20.mx-auto.my-2.md_my-6.z-10(
                    :class="[activeSectionStep === 2 ? activeSectionClass : '', clickClass]", @click="goToStep(2)")
                    .p-3.md_p-5.rounded-full.border.bg-white(:class="{ 'border-primary-100' : activeSectionStep === 2, 'border-grey-200' : isActiveSectionStepBiggerThen(2) }")
                        SVGIcon.w-5.h-5.md_w-7.md_h-7.text-grey-100(svg="clock", :class="{ 'text-primary-100' : activeSectionStep === 2, 'text-grey-200' : isActiveSectionStepBiggerThen(2) }")

                .flex.items-center.justify-center.w-20.h-20.mx-auto.my-2.md_my-6.z-10(
                    :class="[activeSectionStep === 3 ? activeSectionClass : '', clickClass]", @click="goToStep(3)")
                    .p-3.md_p-5.rounded-full.border.bg-white(:class="{ 'border-primary-100' : activeSectionStep === 3, 'border-grey-200' : isActiveSectionStepBiggerThen(3) }")
                        SVGIcon.w-5.h-5.md_w-7.md_h-7.text-grey-100(svg="users-filled", :class="{ 'text-primary-100' : activeSectionStep === 3, 'text-grey-200' : isActiveSectionStepBiggerThen(3) }")

                .flex.items-center.justify-center.w-20.h-20.mx-auto.my-2.md_my-6.z-10(
                    :class="[activeSectionStep === 4 ? activeSectionClass : '', clickClass]", @click="goToStep(4)")
                    .p-3.md_p-5.rounded-full.border.bg-white(:class="{ 'border-primary-100' : activeSectionStep === 4 }")
                        SVGIcon.w-5.h-5.md_w-7.md_h-7.text-grey-100(svg="check", :class="{ 'text-primary-100' : activeSectionStep === 4 }")


            .bg-white.z-10.relative
                div(v-if="activeSectionStep === 1")
                    .px-4.py-6.md_px-10
                        FullCalendar.calendar-client(:options="calendarOptions")
                        p.bg-slate-50.py-1.text-center.text-xs.text-grey-100.w-full.whitespace-nowrap.tracking-wide(v-show="daysClosedSentence.isActive") {{ daysClosedSentence.mainSentence }} {{ daysClosedSentence.listOfDays }}

                div(v-if="activeSectionStep === 2")
                    .px-4.py-6.md_px-10
                        .flex.items-center.gap-1.pb-5.border-b.mb-5.md_mb-0
                            SVGIcon.text-grey-100(svg="calendar", :size="18")
                            p.-mb-1.text-sm.text-grey-300 {{ useDateFormatting(newReservation.date) }}

                        .md_my-6(v-if="lunchWorkTimesList.length")
                            p.mb-4 Pranzo
                            .grid.grid-cols-3.md_grid-cols-5.my-3.gap-2
                                ClientBoxWorkTime(v-for="workTime in lunchWorkTimesList", :key="workTime.id",
                                    :time="workTime.time", :dateSelected="newReservation.date", :isSelected="workTime.time === newReservation.time", @selectTime="selectReservationTimeAndDiscountAmount")

                        .md_my-6(v-if="dinnerWorkTimesList.length")
                            p.mb-4 Cena
                            .grid.grid-cols-3.md_grid-cols-5.my-3.gap-2
                                ClientBoxWorkTime(v-for="workTime in dinnerWorkTimesList", :key="workTime.id",
                                    :time="workTime.time", :dateSelected="newReservation.date", :isSelected="workTime.time === newReservation.time", @selectTime="selectReservationTimeAndDiscountAmount")

                div(v-if="activeSectionStep === 3")
                    .px-4.py-6.md_px-10
                        .pb-5.border-b.mb-5.md_mb-0
                            .flex.items-center.gap-x-3.gap-y-2.md_gap-x-5.flex-wrap
                                .flex.items-center.gap-1
                                    SVGIcon.text-grey-100(svg="calendar", :size="18")
                                    p.text-sm.text-grey-300 {{ useDateFormatting(newReservation.date) }}
                                .flex.items-center.gap-1
                                    SVGIcon.text-grey-100(svg="clock", :size="16")
                                    p.text-sm.text-grey-300 {{ newReservation.time }}
                                .flex.items-center.gap-1.whitespace-nowrap(v-if="newReservation.discountAmount")
                                    SVGIcon.text-red-500(svg="discount", :size="16")
                                    p.text-sm.text-red-400 #[span(class="text-xs tracking-tight") Sconto] {{ newReservation.discountAmount }}%
                            p.text-xs.pt-3.text-grey-100 Stai prenotando per {{ activeRestaurant.name }} - {{ activeRestaurant.address }}, {{ activeRestaurant.city }} {{ activeRestaurant.zipCode }}

                        .md_mt-6
                            .flex.mb-2.gap-4
                                .flex-grow
                                    label.text-xs(for="person-name") Nome
                                    input.w-full.h-10.text-xs.rounded-md.py-1.px-2.border.border-grey-100.bg-transparent.text-black.placeholder_text-grey-100.focus_border-grey-200.focus_outline-none(
                                        v-model="newReservation.personName", name="person-name", id="person-name", type="text", placeholder="Nome*", autocomplete="name" required)
                                .basis-20
                                    label.text-xs(for="people-amount") Persone
                                    .w-full.h-10.bg-transparent.border.border-grey-100.text-xs.rounded-md.flex
                                        select.w-full.py-1.px-2.border-r-4.border-transparent.bg-transparent.focus_ring-transparent.focus_border-transparent(
                                            v-model="newReservation.peopleAmount", name="people-amount", id="people-amount")
                                            option(v-for="number in 10", :key="number", :value="number") {{ number }}                            

                            label.text-xs(for="person-email") Email
                            input.w-full.h-10.text-xs.rounded-md.mb-2.py-1.px-2.border.bg-transparent.text-black.focus_border-grey-200.focus_outline-none(
                                :class="{ 'border-grey-100 placeholder_text-grey-100' : !errorOnInput.personEmail, 'border-error-200 placeholder_text-error-100' : errorOnInput.personEmail  }",
                                v-model="newReservation.personEmail", name="person-email", id="person-email", type="email", placeholder="Email*", autocomplete="email" required)

                            label.text-xs(for="person-phone") Telefono
                            input.w-full.h-10.text-xs.rounded-md.mb-2.py-1.px-2.border.bg-transparent.text-black.focus_border-grey-200.focus_outline-none(
                                :class="{ 'border-grey-100 placeholder_text-grey-100' : !errorOnInput.personPhone, 'border-error-200 placeholder_text-error-100' : errorOnInput.personPhone }",
                                v-model.number="newReservation.personPhone", v-number="number", name="person-phone", id="person-phone", type="tel", maxlength="13", placeholder="Telefono*", autocomplete="tel" required)

                            label.text-xs(for="person-instagram") Instagram (opzionale)
                            input.w-full.h-10.text-xs.rounded-md.mb-2.py-1.px-2.border.border-grey-100.bg-transparent.text-black.placeholder_text-grey-100.focus_border-grey-200.focus_outline-none(
                                v-model="newReservation.personInstagram", name="person-instagram", id="person-instagram", type="text", placeholder="@username")

                            p.mt-2.text-sm.text-error-200.text-center(v-show="errorOnInput.personEmail || errorOnInput.personPhone") Compila le field con dati validi.

                div(v-if="activeSectionStep === 4")
                    .py-16.px-4.md_py-24.md_px-10.flex.items-center.justify-center.gap-5
                        div.text-center
                            SVGIcon.text-primary-100.mx-auto.mb-4(svg="check", :size="60")
                            p.text-base.md_text-lg Congratulazioni {{ newReservation.personName }},
                            p.mt-1.text-sm.md_text-base ti aspettiamo il {{ useDateFormatting(newReservation.date) }} alle {{ newReservation.time }}
                            p.mt-4.text-xs.text-primary-100.leading-relaxed Ordine ID: #[span.bg-slate-100.rounded.p-1 {{ newReservation.id }}]
                            p.mt-5.pt-4.border-t.text-sm.text-grey-200 {{ activeRestaurant.name }} - {{ activeRestaurant.address }}, {{ activeRestaurant.city }} {{ activeRestaurant.zipCode }}


                //- footer
                .px-4.pb-10.md_px-10.flex.items-center.flex-col.md_flex-row(v-if="activeSectionStep !== 4")
                    div
                        p {{ activeRestaurant.name }} 
                        p.text-xs.-mt-1.text-gray-500 {{ activeRestaurant.address }}, {{ activeRestaurant.city }} {{ activeRestaurant.zipCode }}
                    .inline-flex.gap-2.mt-4.md_mt-0.md_ml-auto
                        button.p-2.bg-black.text-white.rounded(v-if="activeSectionStep === 1" @click="navigateTo('/reservation')") Torna Indietro
                        button.p-2.bg-black.text-white.rounded(v-else-if="activeSectionStep !== 4" @click="activeSectionStep = 1") {{ activeSectionStep === 1 ? 'Torna Indietro' : 'Annulla' }}
                        button.p-2.bg-primary-100.text-white.rounded(v-if="activeSectionStep === 3 && activeSectionStep !== 4", :disabled="isFormEmpty", 
                            :class="{ 'disabled_opacity-25' : isFormEmpty }", @click="addReservation()") Conferma
</template>