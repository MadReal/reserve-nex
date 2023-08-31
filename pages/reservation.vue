<script setup lang="ts">
import { storeToRefs } from 'pinia';
const formatDate = (date: string) => useDateTimeFormatting(date).formattedDate

// logic to move between steps
const activeSectionStep = ref(1)
const activeSectionClass = 'after_bottom-0 after_absolute after_border-8 after_border-b-gray-300 after_border-t-transparent after_border-x-transparent'
const isActiveSectionStepBiggerThen = (number: number): boolean => (activeSectionStep.value > number)
const goToStep = (step: number) => step < activeSectionStep.value ? activeSectionStep.value = step : null;

// step 1
// ====================
import { useRestaurantsStore } from '@/stores/Restaurants';
const storeRestaurants = useRestaurantsStore();
const { restaurantsList } = storeToRefs(storeRestaurants)
storeRestaurants.fetchRestaurants();
//
const selectedRestaurant = ref<Restaurant | null>(null)
const selectedRestaurantError = ref(false);
const stepAttempted = ref(false);
const date = ref('')

// step 2
// ====================
import { useWorkTimesStore } from '~/stores/WorkTimes'
const storeWorkTimes = useWorkTimesStore();
const { lunchWorkTimesList, dinnerWorkTimesList } = storeToRefs(storeWorkTimes)
//
const selectedTime = ref<WorkTime | null>(null)
const selectWorkTime = (workTime: WorkTime) => {
    selectedTime.value = workTime
    activeSectionStep.value++
}

// step 2
// ====================
const clientDetails = ref({
    personName: '',
    personEmail: '',
    personPhone: '',
    peopleAmount: 1
})

//************
// CALENDAR
//************
// https://github.com/fullcalendar/fullcalendar-vue
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dateClick(), to drag and create events
import itLocale from '@fullcalendar/core/locales/it';
import { number } from 'joi';

const events = ref([
    {
        start: '2023-09-13',
        end: '2023-09-16',
        display: 'background',
    }
])
const handleDateClick = (dateClickInfo: any) => {
    dateClickInfo.dayEl.style.backgroundColor = 'rgb(0 143 220 / 30%)';
    stepAttempted.value = true
    if (!selectedRestaurant.value) return selectedRestaurantError.value = true
    activeSectionStep.value++
    date.value = formatDate(dateClickInfo.date)
    events.value.push({ start: date.value, end: date.value, display: 'background' })
    // fetch workTimes from selectedRestaurant
    storeWorkTimes.fetchWorkTimes(selectedRestaurant.value.id);
}
const calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    locale: itLocale,
    headerToolbar: { left: 'prev', center: 'title', right: 'next' },
    initialView: 'dayGridMonth',
    events: events.value,
    // fixedWeekCount: false,
    // showNonCurrentDates: false,
    selectable: false,
    dayMaxEvents: true,
    contentHeight: 360,
    dateClick: handleDateClick
}
</script>


<template lang="pug">
.page.relative.-mt-16.z-0
    section
        .max-w-screen-xl.px-4.py-48.mx-auto
            .border.rounded.mx-auto(class="w-6/12")
                .grid.grid-cols-4.relative.border-b.bg-slate-50
                    .mx-10.absolute.inset-x-0.inset-y-0.z-0
                        .absolute.border-b.w-full.h-1.inset-x-0(class="top-1/2")
                    .flex.items-center.justify-center.w-20.h-20.mx-auto.my-6.z-10(:class="activeSectionStep === 1 ? activeSectionClass : ''", @click="goToStep(1)")
                        .p-5.rounded-full.border.bg-white.cursor-pointer(:class="{ 'border-primary-100' : activeSectionStep === 1, 'border-grey-200' : isActiveSectionStepBiggerThen(1) }")
                            SVGIcon.text-grey-100(svg="calendar", :size="30", :class="{ 'text-primary-100' : activeSectionStep === 1, 'text-grey-200' : isActiveSectionStepBiggerThen(1) }")
                    .flex.items-center.justify-center.w-20.h-20.mx-auto.my-6.z-10(:class="activeSectionStep === 2 ? activeSectionClass : ''", @click="goToStep(2)")
                        .p-5.rounded-full.border.bg-white.cursor-pointer(:class="{ 'border-primary-100' : activeSectionStep === 2, 'border-grey-200' : isActiveSectionStepBiggerThen(2) }")
                            SVGIcon.text-grey-100(svg="clock", :size="30", :class="{ 'text-primary-100' : activeSectionStep === 2, 'text-grey-200' : isActiveSectionStepBiggerThen(2) }")
                    .flex.items-center.justify-center.w-20.h-20.mx-auto.my-6.z-10(:class="activeSectionStep === 3 ? activeSectionClass : ''", @click="goToStep(3)")
                        .p-5.rounded-full.border.bg-white.cursor-pointer(:class="{ 'border-primary-100' : activeSectionStep === 3, 'border-grey-200' : isActiveSectionStepBiggerThen(3) }")
                            SVGIcon.text-grey-100(svg="users-filled", :size="30", :class="{ 'text-primary-100' : activeSectionStep === 3, 'text-grey-200' : isActiveSectionStepBiggerThen(3) }")
                    .flex.items-center.justify-center.w-20.h-20.mx-auto.my-6.z-10(:class="activeSectionStep === 4 ? activeSectionClass : ''", @click="goToStep(4)")
                        .p-5.rounded-full.border.bg-white.cursor-pointer(:class="{ 'border-primary-100' : activeSectionStep === 4 }")
                            SVGIcon.text-grey-100(svg="check", :size="30", :class="{ 'text-primary-100' : activeSectionStep === 4 }")


                div(v-if="activeSectionStep === 1")
                    .py-6.px-10
                        label(for="restaurants") Ristorante:
                        .bg-gray-50.border.text-sm.rounded-lg.block.w-full.p-2(:class="{ 'text-gray-900 border-gray-300' : !selectedRestaurantError || !stepAttempted, 'text-error-200 border-error-200' : selectedRestaurantError && stepAttempted}")
                            select.w-full.border-r-4.border-transparent.bg-gray-50.focus_ring-transparent.focus_border-transparent(name="restaurants", id="restaurants", v-model="selectedRestaurant")
                                option(disabled :value="null") Scegli ristorante
                                option(v-for="item in restaurantsList", :key="item.id", :value="item") {{ item.name }}
                    .py-6.px-10
                        FullCalendar.calendar-client(:options="calendarOptions")

                div(v-if="activeSectionStep === 2")
                    .py-6.px-10
                        .flex.items-center.gap-2.pb-5.border-b
                            SVGIcon.text-grey-100(svg="calendar", :size="22")
                            p.-mb-1.text-sm.text-grey-300 {{ date }}

                        .lg_my-6
                            p.mb-4 Pranzo
                            .grid.grid-cols-4.my-3.gap-2
                                ClientBoxWorkTime(v-for="workTime in storeWorkTimes.lunchWorkTimesList", :key="workTime.id" :workTime="workTime", :isSelected="workTime === selectedTime", @selectWorkTime="selectWorkTime")
                        .lg_my-6
                            p.mb-4 Cena
                            .grid.grid-cols-4.my-3.gap-2
                                ClientBoxWorkTime(v-for="workTime in storeWorkTimes.dinnerWorkTimesList", :key="workTime.id" :workTime="workTime", :isSelected="workTime === selectedTime", @selectWorkTime="selectWorkTime")

                div(v-if="activeSectionStep === 3")
                    .py-6.px-10
                        .pb-5.border-b
                            .flex.items-center.gap-5
                                .flex.items-center.gap-2
                                    SVGIcon.text-grey-100(svg="calendar", :size="22")
                                    p.-mb-1.text-sm.text-grey-300 {{ date }}                                
                                .flex.items-center.gap-2
                                    SVGIcon.text-grey-100(svg="clock", :size="20")
                                    p.-mb-1.text-sm.text-grey-300 {{ selectedTime.time }}
                            p.text-xs.pt-3.text-grey-100 Stai prenotando per Officina Del Riso Navigli, Alzaia Naviglio Grande, 62, 20144 Milano MI

                        .lg_mt-6
                            .flex.mb-2.gap-4
                                .flex-grow
                                    label.text-xs(for="personName") Nome
                                    input.w-full.h-10.text-xs.rounded-md.py-1.px-2.border.border-grey-100.bg-transparent.text-black.placeholder_text-grey-100.focus_border-grey-200.focus_outline-none(
                                        v-model="clientDetails.personName", name="personName", id="personName", type="text", placeholder="Nome*", autocomplete="name" required)
                                .basis-20
                                    label.text-xs(for="peopleAmount") Persone
                                    .w-full.h-10.bg-transparent.border.border-grey-100.text-xs.rounded-md.flex
                                        select.w-full.py-1.px-2.border-r-4.border-transparent.bg-transparent.focus_ring-transparent.focus_border-transparent(name="peopleAmount", id="peopleAmount", v-model="clientDetails.peopleAmount")
                                            option(v-for="number in 10", :key="number", :value="number") {{ number }}                            

                            label.text-xs(for="personEmail") Email
                            input.w-full.h-10.text-xs.rounded-md.mb-2.py-1.px-2.border.border-grey-100.bg-transparent.text-black.placeholder_text-grey-100.focus_border-grey-200.focus_outline-none(
                                v-model="clientDetails.personEmail", name="personEmail", id="personEmail", type="email", placeholder="Email*", autocomplete="email" required)

                            label.text-xs(for="restaupersonPhonerants") Telefono
                            input.w-full.h-10.text-xs.rounded-md.mb-2.py-1.px-2.border.border-grey-100.bg-transparent.text-black.placeholder_text-grey-100.focus_border-grey-200.focus_outline-none(
                                v-model="clientDetails.personPhone", name="personPhone", id="personPhone", type="tel", placeholder="Telefono*", autocomplete="tel" required)

                            label.text-xs(for="restaupersonPhonerants") Instagram (opzionale)
                            input.w-full.h-10.text-xs.rounded-md.mb-2.py-1.px-2.border.border-grey-100.bg-transparent.text-black.placeholder_text-grey-100.focus_border-grey-200.focus_outline-none(
                                v-model="clientDetails.personPhone", name="personPhone", id="personPhone", type="tel", placeholder="@username")

                //- footer
                .mb-7.px-10.flex.items-center
                    p(v-if="activeSectionStep !== 1") {{ selectedRestaurant.name }}
                    button.p-2.bg-black.text-white.rounded.ml-auto {{ activeSectionStep === 1 ? 'Torna Indietro' : 'Annulla' }}
                    button.p-2.bg-primary-100.text-white.rounded.ml-2 Conferma
</template>