<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'empty-restaurants-list'], layout: 'admin-default' })
useHead({ title: 'Blocco Orari', })

import { storeToRefs } from 'pinia'
import { useBlocksStore } from '~/stores/Blocks'
import { useWorkTimesStore } from '~/stores/WorkTimes'

const storeBlocks = useBlocksStore()
const storeWorkTimes = useWorkTimesStore();

const { blockedTimeRangeOnDateList } = storeToRefs(storeBlocks)
const { workTimesListsMerged } = storeToRefs(storeWorkTimes)

const noData = computed(() => (!workTimesListsMerged.value.length))

// API CALLS
const addBlockedTimeRangeOnDate = () => storeBlocks.addBlockedTimeRangeOnDate(workTimesListsMerged.value[0].time, workTimesListsMerged.value[workTimesListsMerged.value.length - 1].time)
storeBlocks.fetchBlockedTimeRangeOnDate()
</script>


<template lang="pug">
.page__content
    AdminPageTitle(title="Blocco Orari", subtitle="Gestisci la restrizione delle prenotazioni per determinate fasce orarie in una data specifica.")
    AdminNoData(v-if="noData", text="Aggiungi orari di apertura prima di poter creare blocchi orari.", buttonText="Aggiungi Orari", linkPath="edit-time-open")

    .grid.gap-6.grid-cols-1fr(class="lg_grid-cols-[2fr_1px_2fr]", v-else)
        div.mb-8
            AdminBlockedTimeRangeOnDate(v-for="(item, index) in blockedTimeRangeOnDateList", :key="item.id", :blockTimePeriod="item")

            //- Empty Row - Add Hour Block
            .flex.items-center.justify-between.border.border-dashed.border-grey-100.rounded-lg.py-2.px-3.mb-2.cursor-pointer.hover_bg-slate-50(@click="addBlockedTimeRangeOnDate()")
                p.leading-normal.text-grey-200 Aggiungi Blocco
                SVGIcon.text-grey-300(svg="plus", :size="15")
</template>