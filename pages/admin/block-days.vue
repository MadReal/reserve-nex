<script setup lang="ts">
// https://github.com/fullcalendar/fullcalendar-vue
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dateClick(), to drag and create events

import { storeToRefs } from 'pinia'
import { useBlocksStore } from '~/store/Blocks'

const blocksStore = useBlocksStore()
const { blocksDaysOfWeekList } = storeToRefs(blocksStore)

// used to dynamically set class
const blockedDaysArrayShort = computed(() => blocksDaysOfWeekList.value.length < 1 ? true : false)
// if all days are added
const blockedDaysArrayFull = computed(() => blocksDaysOfWeekList.value.length > 6)

onMounted(async () => { await blocksStore.fetchBlocksDayOfWeek() });

//************
// CALENDAR
//************
const handleEventClick = (clickInfo: any) => {
    // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) clickInfo.event.remove()
    if (confirm(`Sicuro di voler eliminare l'evento '${clickInfo.event.title}'?`)) clickInfo.event.remove()
}
const handleDateSelect = (selectInfo: any) => {
    // let title = prompt('Please enter a new title for your event')
    let title = prompt('Inserisci un titolo for questo evento', 'Blocco giorni')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    calendarApi.addEvent({
        id: Math.random(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
    })
}
const handleEvents = (events: any) => {
    currentEvents = events
}

let currentEvents = []
const calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: { left: 'prev', center: 'title', right: 'next' },
    initialView: 'dayGridMonth',
    events: [],
    editable: true,
    selectable: true,
    // selectMirror: true,
    dayMaxEvents: true,
    contentHeight: 500,
    select: handleDateSelect,
    eventClick: handleEventClick,
    eventsSet: handleEvents,
}
</script>


<template lang="pug">
.page
    PageTitle(title="Blocco Giorni")

    .grid.gap-6.border-b(:class="['grid-cols-[2fr_1px_1fr]', {'items-center' : blockedDaysArrayShort }]")
        div.mt-2.mb-8
            p.text-lg.text-grey-300 Giorno di Chiusura Settimanale
            p.text-sm.text-grey-200.font-light Personalizza il giorno di chiusura settimanale del ristorante. Questa opzione ti consente di stabilire con precisione il giorno in cui il ristorante resterà chiuso ogni settimana.

        //- Divider
        .h-full.border-r

        div.mt-2.mb-8
            //- Display for each day already "blocked"
            BlockDayOfWeek(v-for="day in blocksDaysOfWeekList" :key="day.id" :blockedDaysOfWeekList="blocksDaysOfWeekList", :blockedDay="day",
                @addOrUpdateDay="blocksStore.addOrUpdateBlockDayOfWeek", @removeDay="blocksStore.removeBlock", :isUpdate="true", :showTrash="!blockedDaysArrayShort")
            //- Display the "empty" one, to add a new day
            BlockDayOfWeek(v-if="!blockedDaysArrayFull", :blockedDaysOfWeekList="blocksDaysOfWeekList", 
                @addOrUpdateDay="blocksStore.addOrUpdateBlockDayOfWeek", :isUpdate="false", :showTrash="false")

    FullCalendar.mt-8(:options='calendarOptions')
</template>