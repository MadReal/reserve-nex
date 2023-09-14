<script setup lang="ts">
import { storeToRefs } from "pinia";

interface Props {
  workTime: WorkTime;
  todaysDate: string;
  isSelected?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
});

import { useReservationsStore } from "@/stores/Reservations";
const storeReservations = useReservationsStore();
const { reservationsList } = storeToRefs(storeReservations);

const todaysReservations = reservationsList.value.filter(
  (item) => useDateFormatting(item.date) == props.todaysDate && item.accepted,
);
// if time analyzed from the array equals time being passed from template, add people
const peopleAtThisTime = todaysReservations.reduce(
  (total, item) =>
    item.time === props.workTime.time ? total + item.peopleAmount : total,
  0,
);
</script>

<template lang="pug">
.rounded-lg.p-4.border.border-gray-100.text-grey-200.cursor-pointer(
    :class="{'border-gray-300' : peopleAtThisTime > 0 && !isSelected, 'hover_border-gray-200' : peopleAtThisTime <= 0 && !isSelected, 'border-primary-100' : isSelected }")
    .flex.items-center.justify-center.mb-2(:class="{'text-grey-200' : peopleAtThisTime > 0, 'text-primary-100' : isSelected }")
        SVGIcon.mr-1(svg="clock", :size="14")
        p {{ workTime.time }}
    .flex.items-center.justify-center(:class="{'text-grey-200' : peopleAtThisTime > 0, 'text-primary-100' : isSelected }")
        SVGIcon.mr-1(svg="users", :size="30")
        p.text-xl {{ peopleAtThisTime }}
</template>
