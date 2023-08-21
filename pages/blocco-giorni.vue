<script setup lang="ts">
import restaurantWeekDaysBlocked from "@/data/db-week-days-blocked.json";
import weekDaysAvailable from "@/data/week-days-available.json";

// Define a constant for the imported data
const blockedDaysWeekly = ref(restaurantWeekDaysBlocked);
// Sort the array of objects based on the desired order (take it from my default at week-days-available.json)
const blockedDaysWeeklySorted = computed(() => blockedDaysWeekly.value.sort((a, b) => weekDaysAvailable.indexOf(a.day_name) - weekDaysAvailable.indexOf(b.day_name)))

// handle $emit
const addDay = (day: string) => blockedDaysWeekly.value.push({ id: 0, day_name: day });
const removeDay = (dayName: string) => {
    const dayToRemoveIndex = blockedDaysWeekly.value.findIndex(e => e.day_name === dayName)
    blockedDaysWeekly.value.splice(dayToRemoveIndex, 1)
}
// used to dynamically set class
const blockedDaysArrayShort = computed(() => blockedDaysWeekly.value.length < 1 ? true : false)
// if all days are added
const blockedDaysArrayFull = computed(() => blockedDaysWeekly.value.length > 6)
</script>


<template lang="pug">
.page
    PageTitle(title="Blocco Giorni")

    .grid.gap-6.border-b(:class="['grid-cols-[2fr_1px_1fr]', {'items-center' : blockedDaysArrayShort }]")

        div.mt-2.mb-8
            p.text-lg.text-grey-300 Giorno di Chiusura Settimanale
            p.text-sm.text-grey-200.font-light Personalizza il giorno di chiusura settimanale del ristorante. Questa opzione ti consente di stabilire con precisione il giorno in cui il ristorante resterà chiuso ogni settimana.

        //- Divider
        .h-full.border-r

        div.mt-2.mb-8
            //- Display for each day already "blocked"
            DaySelection(v-for="blockedDay in blockedDaysWeeklySorted" :key="blockedDay.id" :restaurantWeekDaysBlocked="blockedDaysWeeklySorted", :blockedDay="blockedDay",
                @addDay="addDay", @removeDay="removeDay", :showTrash="!blockedDaysArrayShort")
            //- Display the "empty" one, to add a new day
            DaySelection(v-if="!blockedDaysArrayFull", :restaurantWeekDaysBlocked="blockedDaysWeeklySorted", 
                @addDay="addDay", @removeDay="removeDay", :showTrash="false")
</template>
