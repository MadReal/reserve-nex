<script setup lang="ts">
import workHoursRestaurant from "@/data/work-hours-restaurant.json";
import reservations from "@/data/reservations.json";

const todaysDate = useDateTimeFormatting(Date()).formattedDate
const todaysReservations = reservations.filter(item => useDateTimeFormatting(item.date).formattedDate == todaysDate)

// if time analyzed from the array equals time being passed from template, add people
const peopleAtThisTime = (time: string) => todaysReservations.reduce((total, item) => item.time === time ? total + item.people : total, 0);
</script>


<template lang="pug">
.page
    PageTitle(title="Riepilogo Giorno", :date="todaysDate")

    .grid(class="grid-cols-[1fr_1px_1fr]").gap-6.border-b
        //- Pranzo
        div.mb-6
            p.mb-4 Pranzo
            .grid.grid-cols-4.gap-2
                .rounded.p-4.border.border-gray-100.text-grey-200(v-for="time in workHoursRestaurant.pranzo", key="time", :class="{'border-primary-100' : peopleAtThisTime(time) > 0 }")
                    .flex.items-center.justify-center.mb-2(:class="{'text-primary-100' : peopleAtThisTime(time) > 0 }")
                        SVGIcon.mr-1(svg="clock", :size="15")
                        p {{ time }}
                    .flex.items-center.justify-center(:class="{'text-primary-100' : peopleAtThisTime(time) > 0 }")
                        SVGIcon.mr-1(svg="users", :size="30")
                        p.text-xl {{ peopleAtThisTime(time) }}

        //- Divider
        .h-full.border-r

        //- Cena
        div.mb-6
            p.mb-4 Cena
            .grid.grid-cols-4.gap-2
                .rounded.p-4.border.border-gray-100.text-grey-200(v-for="time in workHoursRestaurant.cena", key="time", :class="{'border-primary-100' : peopleAtThisTime(time) > 0 }")
                    .flex.items-center.justify-center.mb-2(:class="{'text-primary-100' : peopleAtThisTime(time) > 0 }")
                        SVGIcon.mr-1(svg="clock", :size="15")
                        p {{ time }}
                    .flex.items-center.justify-center(:class="{'text-primary-100' : peopleAtThisTime(time) > 0 }")
                        SVGIcon.mr-2(svg="users", :size="30")
                        p.text-xl {{ peopleAtThisTime(time) }}
</template>
