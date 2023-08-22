<script setup lang="ts">
import reservations from "@/data/db-reservations.json";

export interface BoxReservationProps {
    workHour: WorkHour,
    todaysDate: string
}
const props = defineProps<BoxReservationProps>()

const todaysReservations = reservations.filter(item => useDateTimeFormatting(item.date).formattedDate == props.todaysDate)
// if time analyzed from the array equals time being passed from template, add people
const peopleAtThisTime = todaysReservations.reduce((total, item) => item.time === props.workHour.timeSlot ? total + item.people : total, 0);
</script>


<template lang="pug">
.rounded-lg.p-4.border.border-gray-100.text-grey-200(:class="{'border-primary-100' : peopleAtThisTime > 0 }")
    .flex.items-center.justify-center.mb-2(:class="{'text-primary-100' : peopleAtThisTime > 0 }")
        SVGIcon.mr-1(svg="clock", :size="15")
        p {{ workHour.timeSlot }}
    .flex.items-center.justify-center(:class="{'text-primary-100' : peopleAtThisTime > 0 }")
        SVGIcon.mr-1(svg="users", :size="30")
        p.text-xl {{ peopleAtThisTime }}
</template>
