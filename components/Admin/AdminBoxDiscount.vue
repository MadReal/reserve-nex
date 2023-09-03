<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDiscountsStore } from '@/stores/Discounts';
import Draggable from 'vuedraggable'
// https://okamuuu.com/posts/xjni9lf5h for SWAP

interface BoxReservationProps {
    workTime: WorkTime,
}
const props = defineProps<BoxReservationProps>()
const emit = defineEmits(['addDiscount'])


const storeDiscount = useDiscountsStore();


const hours = ref([])
function onCopy() {
    console.log('onCopy');
    // Push a copy of the item to the target list
    // hours.value.push(original);
}
function onSourceListEnd() {
    console.log('onSourceListEnd');
    // Remove items from the source list if needed
    // For example, if you want to move items instead of copying
    // this.sourceList = this.sourceList.filter(item => !this.targetList.includes(item));
}
async function change(e: any) {
    const discountAmount = e.added.element
    emit('addDiscount', discountAmount, props.workTime)
}
</script>


<template lang="pug">
.h-20.py-3.px-1.text-grey-200.rounded-lg.border.border-gray-100
    .flex.items-center.justify-center.mb-2
        .mr-1: SVGIcon(svg="clock", :size="14")
        p {{ workTime.time }}

    Draggable(v-model="hours" group="universalGroup", itemKey="id", :sort="false", :swap="true", swapClass="highlight", @change="change" @end="onSourceListEnd" @copy="onCopy")
        template(#item="{ element, index }")
            p.h-7.p-1.rounded.bg-red-500.text-white.text-sm.text-center.cursor-grab {{ element.amount }}%
</template>
