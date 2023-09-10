<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'empty-restaurants-list'], layout: 'admin-default' })
useHead({ title: 'Blocco Giorni', })


import { storeToRefs } from 'pinia'
import { useBlocksStore } from '~/stores/Blocks'
const storeBlocks = useBlocksStore()

const { blockedDaysOfWeekList, blockedDatesListFullCalendar } = storeToRefs(storeBlocks)
// used to dynamically set class
const isblockedDaysOfWeekListShort = computed(() => blockedDaysOfWeekList.value.length < 1)
// if all days are added
const isBlockedDaysOfWeekListFull = computed(() => blockedDaysOfWeekList.value.length > 6)


//************
// CALENDAR
//************
// https://github.com/fullcalendar/fullcalendar-vue
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dateClick(), to drag and create events
import itLocale from '@fullcalendar/core/locales/it';

const handleEventClick = async (clickInfo: any) => {
    const blockId: Block['id'] = clickInfo.event.id
    if (confirm(`Sicuro di voler eliminare l'evento '${clickInfo.event.title}'?`)) {
        await storeBlocks.removeBlock(blockId)
        clickInfo.event.remove()
    }
}
const handleDateSelect = async (selectInfo: any) => {
    let title = prompt('Inserisci un titolo per questo evento', 'Blocco giorni')
    // Define an array of swear words to check against
    const swearWords = ['fanculo', 'troia', 'puttana', 'dio cane', 'diocane', 'porco dio', 'merda'];

    if (title) {
        // Convert the user's input to lowercase to make the check case-insensitive
        const lowercasedTitle = title.toLowerCase();
        // Check if the user's input contains any swear words
        if (swearWords.some(word => lowercasedTitle.includes(word))) {
            // Display an alert message if a swear word is found
            alert('Per favore, evita di utilizzare linguaggio offensivo.');
            return; // Exit the function
        }

        const newblockDatesPeriod = await storeBlocks.addBlockedDate(selectInfo.startStr, selectInfo.endStr, title)
        let calendarApi = selectInfo.view.calendar
        calendarApi.unselect() // clear date selection
        calendarApi.addEvent({
            // @ts-ignore
            id: newblockDatesPeriod.id,
            title,
            // @ts-ignore
            start: newblockDatesPeriod?.dateStart,
            // @ts-ignore
            end: newblockDatesPeriod?.dateEnd,
            allDay: selectInfo.allDay
        })
    }
}

const handleDragAndResize = (info: any) => {
    const blockedDate = info.event
    storeBlocks.updateBlockedDate(blockedDate.id, blockedDate.start, blockedDate.end)
}

const calendarOptions = ref({
    plugins: [dayGridPlugin, interactionPlugin],
    locale: itLocale,
    headerToolbar: { left: 'prev', center: 'title', right: 'next' },
    initialView: 'dayGridMonth',
    editable: true,
    selectable: true,
    dayMaxEvents: true,
    contentHeight: 480,
    events: blockedDatesListFullCalendar,
    select: handleDateSelect,
    eventClick: handleEventClick,
    // eventsSet: handleEvents
    eventDrop: handleDragAndResize,
    eventResize: handleDragAndResize
})
// API CALLS
storeBlocks.fetchBlockedDaysOfWeek()
storeBlocks.fetchBlockedDates()
</script>


<template lang="pug">
.page__content
    AdminPageTitle(title="Blocco Giorni")

    .grid.border-b.lg_gap-6(:class="['lg_grid-cols-[2fr_1px_1fr]', {'items-center' : isblockedDaysOfWeekListShort }]")
        .lg_mt-1.mb-8
            p.text-lg.text-grey-300 Giorno di Chiusura Settimanale
            p.text-sm.text-grey-100.font-light Personalizza il giorno di chiusura settimanale del ristorante. Questa opzione ti consente di stabilire con precisione il giorno in cui il ristorante resterà chiuso ogni settimana.

        //- Divider
        .hidden.lg_block.lg_h-full.lg_border-r

        .mb-8.md_mb-6.md_mt-1
            //- Display for each day already "blocked"
            AdminBlockedDayOfWeek(v-for="day in blockedDaysOfWeekList" :key="day.id" :blockedDaysOfWeekList="blockedDaysOfWeekList", :blockedDay="day",
                @addOrUpdateDay="storeBlocks.addOrUpdateBlockedDayOfWeek", @removeDay="storeBlocks.removeBlock", 
                :isUpdate="true", :showTrash="!isblockedDaysOfWeekListShort")
            //- Display the "empty" one, to add a new day
            AdminBlockedDayOfWeek(v-if="!isBlockedDaysOfWeekListFull", :blockedDaysOfWeekList="blockedDaysOfWeekList", 
                @addOrUpdateDay="storeBlocks.addOrUpdateBlockedDayOfWeek", 
                :isUpdate="false", :showTrash="false")

    div                
        .mt-8.mb-8
            p.text-lg.text-grey-300 Aggiungi Periodi di Chiusura o Vacanze
            p.text-sm.text-grey-100.font-light Clicca e trascina per selezionare i giorni di chiusura. Ridimensiona o cancella i blocchi di chiusura. 
                #br Fornisci i blocchi con titoli, in modo che i tuoi clienti conoscano il motivo della chiusura.

        FullCalendar.calendar-admin.mt-10.lg_mt-8(:options="calendarOptions")
</template>