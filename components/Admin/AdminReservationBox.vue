<script setup lang="ts">
import { storeToRefs } from 'pinia'

interface BoxReservationProps {
    workTime: WorkTime,
    todaysDate: string
}
const props = defineProps<BoxReservationProps>()

import { useReservationsStore } from '@/stores/Reservations';
const storeReservations = useReservationsStore();
const { reservationsList } = storeToRefs(storeReservations)

const todaysReservations = reservationsList.value.filter(item => useDateFormatting(item.date) == props.todaysDate && item.accepted)
// if time analyzed from the array equals time being passed from template, add people
const peopleAtThisTime = todaysReservations.reduce((total, item) => item.time === props.workTime.time ? total + item.peopleAmount : total, 0);
</script>


<template lang="pug">
.rounded-lg.p-4.border.border-gray-100.text-grey-200(:class="{'border-primary-100' : peopleAtThisTime > 0 }")
    .flex.items-center.justify-center.mb-2(:class="{'text-primary-100' : peopleAtThisTime > 0 }")
        SVGIcon.mr-1(svg="clock", :size="14")
        p {{ workTime.time }}
    .flex.items-center.justify-center(:class="{'text-primary-100' : peopleAtThisTime > 0 }")
        SVGIcon.mr-1(svg="users", :size="30")
        p.text-xl {{ peopleAtThisTime }}
</template>
