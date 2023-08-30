<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRestaurantsStore } from '@/stores/Restaurants';
import { getPastDate } from '@/server/utils/getPastDate';

const storeRestaurants = useRestaurantsStore();
const { restaurantsList } = storeToRefs(storeRestaurants)

storeRestaurants.fetchRestaurants()

const date = ref('')

const activeSectionStep = ref(1)
const activeSectionAfterClass = 'after_bottom-0 after_absolute after_border-8 after_border-b-black after_border-t-transparent after_border-x-transparent'

const disabledDates = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

    const disabledDatesArray = [];
    for (let i = new Date(0); i < today; i.setDate(i.getDate() + 1)) {
        disabledDatesArray.push(new Date(i));
    }

    return disabledDatesArray;
});


//************
// CALENDAR
//************
// https://github.com/fullcalendar/fullcalendar-vue
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dateClick(), to drag and create events
import itLocale from '@fullcalendar/core/locales/it';

const handleDateClick = (dateClickInfo: any) => {
    console.log('day', dateClickInfo.date.toISOString());
    // change the day's background color just for fun 
    dateClickInfo.dayEl.style.backgroundColor = 'red';
}

const getPastDate = (daysBack = 1): string => {
    const date = new Date();
    date.setDate(date.getDate());

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const events = ref([
    {
        start: '2020-01-01',
        end: getPastDate(),
        display: 'background',
        constraint: {
            start: '2020-01-01',
            end: getPastDate(),
        }
    },
    {
        start: '2023-09-13',
        end: '2023-09-16',
        display: 'background',
    }
])


const calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    locale: itLocale,
    headerToolbar: { left: 'prev', center: 'title', right: 'next' },
    initialView: 'dayGridMonth',
    // validRange: function () {
    //     return {
    //         start: getPastDate(),
    //         end: '2033-09-13'
    //     };
    // },
    events: events.value,
    // fixedWeekCount: false,
    // showNonCurrentDates: false,
    selectable: false,
    dayMaxEvents: true,
    contentHeight: 380,
    // navLinks: true,
    // navLinkDayClick: handleDateClick,
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
                    .flex.items-center.justify-center.w-20.h-20.mx-auto.my-6.z-10(:class="activeSectionStep === 1 ? activeSectionAfterClass : ''")
                        .p-5.rounded-full.border.bg-white
                            SVGIcon.text-grey-100(svg="calendar", :size="30")                    
                    .flex.items-center.justify-center.w-20.h-20.mx-auto.my-6.z-10(:class="activeSectionStep === 2 ? activeSectionAfterClass : ''")
                        .p-5.rounded-full.border.bg-white
                            SVGIcon.text-grey-100(svg="clock", :size="30")                    
                    .flex.items-center.justify-center.w-20.h-20.mx-auto.my-6.z-10(:class="activeSectionStep === 3 ? activeSectionAfterClass : ''")
                        .p-5.rounded-full.border.bg-white
                            SVGIcon.text-grey-100(svg="users-filled", :size="30")                    
                    .flex.items-center.justify-center.w-20.h-20.mx-auto.my-6.z-10(:class="activeSectionStep === 4 ? activeSectionAfterClass : ''")
                        .p-5.rounded-full.border.bg-white
                            SVGIcon.text-grey-100(svg="check", :size="30")

                .p-6.px-10
                    label(for="restaurantsList") Ristorante:
                    .bg-gray-50.border.border-gray-300.text-gray-900.text-sm.rounded-lg.block.w-full.p-2(name="restaurantsList" id="restaurantsList")
                        select.w-full.border-r-4.border-transparent.bg-gray-50.focus_ring-transparent.focus_border-transparent
                            option(selected) Scegli ristorante
                            option(v-for="item in restaurantsList", :key="item.id") {{ item.name }}

                .p-6.px-10
                    FullCalendar.calendar-client(:options="calendarOptions")

</template>