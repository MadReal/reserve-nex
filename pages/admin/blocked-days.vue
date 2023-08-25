<script setup lang="ts">
// https://github.com/fullcalendar/fullcalendar-vue
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dateClick(), to drag and create events
import { storeToRefs } from 'pinia'
import { useBlocksStore } from '~/store/Blocks'
const storeBlocks = useBlocksStore()

const { blockedDaysOfWeekList, blockedDatesListFullCalendar } = storeToRefs(storeBlocks)
// used to dynamically set class
const isblockedDaysOfWeekListShort = computed(() => blockedDaysOfWeekList.value.length < 1)
// if all days are added
const isBlockedDaysOfWeekListFull = computed(() => blockedDaysOfWeekList.value.length > 6)

//************
// CALENDAR
//************
const handleEventClick = async (clickInfo: any) => {
    const blockId: Block['id'] = clickInfo.event.id
    if (confirm(`Sicuro di voler eliminare l'evento '${clickInfo.event.title}'?`)) {
        await storeBlocks.removeBlock(blockId)
        clickInfo.event.remove()
    }
}
const handleDateSelect = async (selectInfo: any) => {
    let title = prompt('Inserisci un titolo for questo evento', 'Blocco giorni')
    if (title) {
        const newblockDatesPeriod = await storeBlocks.addBlockedDate(selectInfo.startStr, selectInfo.endStr, title)
        let calendarApi = selectInfo.view.calendar
        calendarApi.unselect() // clear date selection
        calendarApi.addEvent({
            id: newblockDatesPeriod?.id,
            title,
            start: newblockDatesPeriod?.dateStart,
            end: newblockDatesPeriod?.dateEnd,
            allDay: selectInfo.allDay
        })
    }
}

const calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: { left: 'prev', center: 'title', right: 'next' },
    initialView: 'dayGridMonth',
    events: blockedDatesListFullCalendar,
    editable: true,
    selectable: true,
    dayMaxEvents: true,
    contentHeight: 500,
    select: handleDateSelect,
    eventClick: handleEventClick,
}

watch(blockedDatesListFullCalendar, (newEvents) => calendarOptions.events = newEvents);
onBeforeMount(async () => {
    await storeBlocks.fetchBlockedDaysOfWeek()
    await storeBlocks.fetchBlockedDates()
});
</script>


<template lang="pug">
.page
    PageTitle(title="Blocco Giorni")

    .grid.gap-6.border-b(:class="['grid-cols-[2fr_1px_1fr]', {'items-center' : isblockedDaysOfWeekListShort }]")
        div.mt-2.mb-8
            p.text-lg.text-grey-300 Giorno di Chiusura Settimanale
            p.text-sm.text-grey-200.font-light Personalizza il giorno di chiusura settimanale del ristorante. Questa opzione ti consente di stabilire con precisione il giorno in cui il ristorante resterà chiuso ogni settimana.

        //- Divider
        .h-full.border-r

        div.mt-2.mb-8
            //- Display for each day already "blocked"
            BlockedDayOfWeek(v-for="day in blockedDaysOfWeekList" :key="day.id" :blockedDaysOfWeekList="blockedDaysOfWeekList", :blockedDay="day",
                @addOrUpdateDay="storeBlocks.addOrUpdateBlockedDayOfWeek", @removeDay="storeBlocks.removeBlock", 
                :isUpdate="true", :showTrash="!isblockedDaysOfWeekListShort")
            //- Display the "empty" one, to add a new day
            BlockedDayOfWeek(v-if="!isBlockedDaysOfWeekListFull", :blockedDaysOfWeekList="blockedDaysOfWeekList", 
                @addOrUpdateDay="storeBlocks.addOrUpdateBlockedDayOfWeek", 
                :isUpdate="false", :showTrash="false")

    FullCalendar.mt-8(:options="calendarOptions")
</template>