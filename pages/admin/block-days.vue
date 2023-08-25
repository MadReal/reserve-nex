<script setup lang="ts">
// https://github.com/fullcalendar/fullcalendar-vue
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dateClick(), to drag and create events

import { storeToRefs } from 'pinia'
import { useBlocksStore } from '~/store/Blocks'

const blocksStore = useBlocksStore()
const { blocksDaysOfWeekList } = storeToRefs(blocksStore)
const { blocksDayPeriodListFullCalendar } = storeToRefs(blocksStore)

// used to dynamically set class
const isBlocksDaysOfWeekListShort = computed(() => blocksDaysOfWeekList.value.length < 1)
// if all days are added
const isBlockedDaysOfWeekListFull = computed(() => blocksDaysOfWeekList.value.length > 6)

onMounted(async () => {
    await blocksStore.fetchBlocksDayOfWeek()
    await blocksStore.fetchBlocksDayPeriod()
});

//************
// CALENDAR
//************
const handleEventClick = (clickInfo: any) => {
    if (confirm(`Sicuro di voler eliminare l'evento '${clickInfo.event.title}'?`)) clickInfo.event.remove()
}
const handleDateSelect = async (selectInfo: any) => {
    console.log(selectInfo);

    let title = prompt('Inserisci un titolo for questo evento', 'Blocco giorni')
    if (title) {
        const newBlockDayPeriod = await blocksStore.addBlockDayPeriod(selectInfo.startStr, selectInfo.endStr, title)

        let calendarApi = selectInfo.view.calendar
        calendarApi.unselect() // clear date selection
        calendarApi.addEvent({
            id: newBlockDayPeriod?.id,
            title,
            start: newBlockDayPeriod?.dateStart,
            end: newBlockDayPeriod?.dateEnd,
            allDay: selectInfo.allDay
        })
    }
}

const calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: { left: 'prev', center: 'title', right: 'next' },
    initialView: 'dayGridMonth',
    events: blocksDayPeriodListFullCalendar,
    editable: true,
    selectable: true,
    dayMaxEvents: true,
    contentHeight: 500,
    select: handleDateSelect,
    eventClick: handleEventClick,
}

watch(blocksDayPeriodListFullCalendar, (newEvents) => calendarOptions.events = newEvents);
</script>


<template lang="pug">
.page
    PageTitle(title="Blocco Giorni")

    .grid.gap-6.border-b(:class="['grid-cols-[2fr_1px_1fr]', {'items-center' : isBlocksDaysOfWeekListShort }]")
        div.mt-2.mb-8
            p.text-lg.text-grey-300 Giorno di Chiusura Settimanale
            p.text-sm.text-grey-200.font-light Personalizza il giorno di chiusura settimanale del ristorante. Questa opzione ti consente di stabilire con precisione il giorno in cui il ristorante resterà chiuso ogni settimana.

        //- Divider
        .h-full.border-r

        div.mt-2.mb-8
            //- Display for each day already "blocked"
            BlockDayOfWeek(v-for="day in blocksDaysOfWeekList" :key="day.id" :blockedDaysOfWeekList="blocksDaysOfWeekList", :blockedDay="day",
                @addOrUpdateDay="blocksStore.addOrUpdateBlockDayOfWeek", @removeDay="blocksStore.removeBlock", 
                :isUpdate="true", :showTrash="!isBlocksDaysOfWeekListShort")
            //- Display the "empty" one, to add a new day
            BlockDayOfWeek(v-if="!isBlockedDaysOfWeekListFull", :blockedDaysOfWeekList="blocksDaysOfWeekList", 
                @addOrUpdateDay="blocksStore.addOrUpdateBlockDayOfWeek", 
                :isUpdate="false", :showTrash="false")

    FullCalendar.mt-8(:options="calendarOptions")
</template>