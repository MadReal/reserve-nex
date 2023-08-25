<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBlocksStore } from '~/store/Blocks'
import { useWorkTimesStore } from '~/store/WorkTimes'

const storeBlocks = useBlocksStore()
const storeWorkTimes = useWorkTimesStore();

const { blocksTimePeriodList } = storeToRefs(storeBlocks)
const { workTimesListsMerged } = storeToRefs(storeWorkTimes)

// API CALLS
const addBlockTimePeriod = () => storeBlocks.addBlockTimePeriod(workTimesListsMerged.value[0].time, workTimesListsMerged.value[workTimesListsMerged.value.length - 1].time)

onMounted(async () => {
    await storeWorkTimes.fetchWorkTimes()
    await storeBlocks.fetchBlocksTimePeriod()
});
</script>


<template lang="pug">
.page
    PageTitle(title="Blocco Orari")

    .grid.gap-6(class="grid-cols-[2fr_1px_1fr]")
        div.mb-8
            BlockTimePeriod(v-for="(item, index) in blocksTimePeriodList", :key="item.id", :blockTimePeriod="item")

            //- Empty Row - Add Hour Block
            .flex.items-center.justify-between.border.border-dashed.border-grey-100.rounded-lg.py-2.px-3.mb-2.cursor-pointer.hover_bg-slate-50(@click="addBlockTimePeriod()")
                p.leading-normal.text-grey-200 Aggiungi Blocco
                SVGIcon.text-grey-300(svg="plus", :size="15")
</template>


<style>
:root {
    --dp-font-family: "Poppins", sans-serif
}
</style>