<script setup lang="ts">
import restaurantWeekDaysBlocked from "@/data/db-week-days-blocked.json";

// Define a constant for the imported data
const blockedDays = ref(restaurantWeekDaysBlocked);
// handle $emit
const selectDay = (day: string) => blockedDays.value.push(day);
// used to dynamically set class
const blockedDaysArrayShort = blockedDays.value.length < 1 ? true : false;
// if all days are added
const blockedDaysArrayFull = computed(() => blockedDays.value.length > 6)
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
            DaySelection(v-for="blockedDay in blockedDays" :key="blockedDay" :restaurantWeekDaysBlocked="blockedDays", :blockedDay="blockedDay" @selectDay="selectDay")
            //- Display the "empty" one, to add a new day
            DaySelection(v-if="!blockedDaysArrayFull", :restaurantWeekDaysBlocked="blockedDays", @selectDay="selectDay")
</template>
