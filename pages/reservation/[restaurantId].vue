<script setup lang="ts">
import { storeToRefs } from 'pinia';
const route = useRoute();

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
    id: null!,
    time: '',
    date: null!,
    personName: '',
    personEmail: '',
    personPhone: '',
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
//
const selectReservationTime = (time: WorkTime["time"]) => {
    newReservation.value.time = time
    activeSectionStep.value++
}

// step 3
// ====================
import { useReservationsStore } from '@/stores/Reservations';
const storeReservations = useReservationsStore();
// 
const formInputEmpty = computed(() => {
    const { id, time, date, restaurantId, personInstagram, ...otherDetails } = newReservation.value;
    return Object.values(otherDetails).some(value => value === '' || value === null);
});
async function addReservation() {
    const { id, ...reservationData } = newReservation.value;
    const reservation = await storeReservations.addReservation(reservationData);
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
    dateClickInfo.dayEl.style.backgroundColor = 'rgb(0 143 220 / 30%)';
    activeSectionStep.value++;

    // Get the date as a string without the time
    // const selectedDate = dateClickInfo.date.toLocaleDateString('it-IT');
    const selectedDate = dateClickInfo.date

    newReservation.value.date = selectedDate;
    storeWorkTimes.fetchWorkTimes(restaurantIdParam);
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
// // @ts-ignore
// watch(blockedDatesListFullCalendar, (newEvents) => calendarOptions.events = newEvents);
// // @ts-ignore
// watch(hiddenDaysOfWeek, (newEvents) => calendarOptions.hiddenDays = newEvents);

storeBlocks.fetchBlockedDaysOfWeek(restaurantIdParam)
storeBlocks.fetchBlockedDates(restaurantIdParam)
storeBlocks.fetchBlockedTimesOnDay(restaurantIdParam)
</script>


<template lang="pug">
.page.relative.-mt-16.z-0
    section
        .max-w-screen-xl.px-4.py-48.mx-auto
            .border.rounded.mx-auto.min-h-min(class="w-6/12")
                .grid.grid-cols-4.relative.border-b.bg-slate-50
                    //- line in the background
                    .mx-10.absolute.inset-x-0.inset-y-0.z-0
                        .absolute.border-b.w-full.h-1.inset-x-0(class="top-1/2")

                    .flex.items-center.justify-center.w-20.h-20.mx-auto.my-6.z-10(:class="activeSectionStep === 1 ? activeSectionClass : ''", @click="goToStep(1)")
                        .p-5.rounded-full.border.bg-white(
                            :class="[{ 'border-primary-100' : activeSectionStep === 1, 'border-grey-200' : isActiveSectionStepBiggerThen(1)}, clickClass]")
                            SVGIcon.text-grey-100(svg="calendar", :size="30", :class="{ 'text-primary-100' : activeSectionStep === 1, 'text-grey-200' : isActiveSectionStepBiggerThen(1) }")

                    .flex.items-center.justify-center.w-20.h-20.mx-auto.my-6.z-10(
                        :class="[activeSectionStep === 2 ? activeSectionClass : '', clickClass]", @click="goToStep(2)")
                        .p-5.rounded-full.border.bg-white(:class="{ 'border-primary-100' : activeSectionStep === 2, 'border-grey-200' : isActiveSectionStepBiggerThen(2) }")
                            SVGIcon.text-grey-100(svg="clock", :size="30", :class="{ 'text-primary-100' : activeSectionStep === 2, 'text-grey-200' : isActiveSectionStepBiggerThen(2) }")

                    .flex.items-center.justify-center.w-20.h-20.mx-auto.my-6.z-10(
                        :class="[activeSectionStep === 3 ? activeSectionClass : '', clickClass]", @click="goToStep(3)")
                        .p-5.rounded-full.border.bg-white(:class="{ 'border-primary-100' : activeSectionStep === 3, 'border-grey-200' : isActiveSectionStepBiggerThen(3) }")
                            SVGIcon.text-grey-100(svg="users-filled", :size="30", :class="{ 'text-primary-100' : activeSectionStep === 3, 'text-grey-200' : isActiveSectionStepBiggerThen(3) }")

                    .flex.items-center.justify-center.w-20.h-20.mx-auto.my-6.z-10(
                        :class="[activeSectionStep === 4 ? activeSectionClass : '', clickClass]", @click="goToStep(4)")
                        .p-5.rounded-full.border.bg-white(:class="{ 'border-primary-100' : activeSectionStep === 4 }")
                            SVGIcon.text-grey-100(svg="check", :size="30", :class="{ 'text-primary-100' : activeSectionStep === 4 }")


                div(v-if="activeSectionStep === 1")
                    .py-6.px-10
                        FullCalendar.calendar-client(:options="calendarOptions")
                        p.bg-slate-50.py-1.text-center.text-xs.text-grey-100.w-full.whitespace-nowrap.tracking-wide(v-show="daysClosedSentence.isActive") {{ daysClosedSentence.mainSentence }} {{ daysClosedSentence.listOfDays }}

                div(v-if="activeSectionStep === 2")
                    .py-6.px-10
                        .flex.items-center.gap-1.pb-5.border-b
                            SVGIcon.text-grey-100(svg="calendar", :size="18")
                            p.-mb-1.text-sm.text-grey-300 {{ useDateFormatting(newReservation.date) }}

                        .lg_my-6(v-if="storeWorkTimes.lunchWorkTimesList.length")
                            p.mb-4 Pranzo
                            .grid.grid-cols-5.my-3.gap-2
                                ClientBoxWorkTime(v-for="workTime in storeWorkTimes.lunchWorkTimesList", :key="workTime.id" 
                                    :time="workTime.time", :dateSelected="newReservation.date", :isSelected="workTime.time === newReservation.time", @selectTime="selectReservationTime")
                        .lg_my-6(v-if="storeWorkTimes.dinnerWorkTimesList.length")
                            p.mb-4 Cena
                            .grid.grid-cols-5.my-3.gap-2
                                ClientBoxWorkTime(v-for="workTime in storeWorkTimes.dinnerWorkTimesList", :key="workTime.id" 
                                    :time="workTime.time", :dateSelected="newReservation.date", :isSelected="workTime.time === newReservation.time", @selectTime="selectReservationTime")

                div(v-if="activeSectionStep === 3")
                    .py-6.px-10
                        .pb-5.border-b
                            .flex.items-center.gap-5
                                .flex.items-center.gap-1
                                    SVGIcon.text-grey-100(svg="calendar", :size="18")
                                    p.-mb-1.text-sm.text-grey-300 {{ useDateFormatting(newReservation.date) }}
                                .flex.items-center.gap-1
                                    SVGIcon.text-grey-100(svg="clock", :size="16")
                                    p.-mb-1.text-sm.text-grey-300 {{ newReservation.time }}
                            p.text-xs.pt-3.text-grey-100 Stai prenotando per {{ activeRestaurant.name }} - {{ activeRestaurant.address }}, {{ activeRestaurant.city }} {{ activeRestaurant.zipCode }}

                        .lg_mt-6
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
                            input.w-full.h-10.text-xs.rounded-md.mb-2.py-1.px-2.border.border-grey-100.bg-transparent.text-black.placeholder_text-grey-100.focus_border-grey-200.focus_outline-none(
                                v-model="newReservation.personEmail", name="person-email", id="person-email", type="email", placeholder="Email*", autocomplete="email" required)

                            label.text-xs(for="person-phone") Telefono
                            input.w-full.h-10.text-xs.rounded-md.mb-2.py-1.px-2.border.border-grey-100.bg-transparent.text-black.placeholder_text-grey-100.focus_border-grey-200.focus_outline-none(
                                v-model="newReservation.personPhone", name="person-phone", id="person-phone", type="tel", placeholder="Telefono*", autocomplete="tel" required)

                            label.text-xs(for="person-instagram") Instagram (opzionale)
                            input.w-full.h-10.text-xs.rounded-md.mb-2.py-1.px-2.border.border-grey-100.bg-transparent.text-black.placeholder_text-grey-100.focus_border-grey-200.focus_outline-none(
                                v-model="newReservation.personInstagram", name="person-instagram", id="person-instagram", type="tel", placeholder="@username")

                div(v-if="activeSectionStep === 4")
                    .py-24.px-10.flex.items-center.justify-center.gap-5
                        div.text-center
                            SVGIcon.text-primary-100.mx-auto.mb-4(svg="check", :size="60")
                            p.text-lg Congratulazioni {{ newReservation.personName }},
                            p.mt-1 ti aspettiamo il {{ useDateFormatting(newReservation.date) }} alle {{ newReservation.time }}
                            p.mt-4.text-xs.text-primary-100 Ordine ID: #[span.bg-slate-100.rounded.p-1 {{ newReservation.id }}]
                            p.mt-5.pt-4.border-t.text-sm.text-grey-200 {{ activeRestaurant.name }} - {{ activeRestaurant.address }}, {{ activeRestaurant.city }} {{ activeRestaurant.zipCode }}


                //- footer
                .mb-10.px-10.flex.items-center
                    div(v-if="activeSectionStep !== 1 && activeSectionStep !== 4")
                        p {{ activeRestaurant.name }} 
                        p.text-xs.-mt-1.text-gray-500 {{ activeRestaurant.address }}, {{ activeRestaurant.city }} {{ activeRestaurant.zipCode }}
                    button.p-2.bg-black.text-white.rounded.ml-auto(v-if="activeSectionStep !== 4" @click="activeSectionStep = 1") {{ activeSectionStep === 1 ? 'Torna Indietro' : 'Annulla' }}
                    button.p-2.bg-primary-100.text-white.rounded.ml-2(v-if="activeSectionStep === 3 && activeSectionStep !== 4", :disabled="formInputEmpty", :class="{ 'disabled_opacity-25' : formInputEmpty }", @click="addReservation()") Conferma
</template>