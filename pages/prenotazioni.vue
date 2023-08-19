<script setup lang="ts">
import reservations from "@/data/reservations.json";

const formatDateAndTime = (isoTimestamp: string) => {
    const dateObject = new Date(isoTimestamp);

    // Extracting the date
    const year = dateObject.getUTCFullYear();
    const month = dateObject.getUTCMonth() + 1;
    const day = dateObject.getUTCDate();
    const extractedDate = `${year}-${month}-${day}`;

    // Extracting the time
    const hours = dateObject.getUTCHours();
    const minutes = dateObject.getUTCMinutes();
    const seconds = dateObject.getUTCSeconds();
    const milliseconds = dateObject.getUTCMilliseconds();
    const extractedTime = `${hours}:${minutes}:${seconds}.${milliseconds}`;

    return { extractedDate, extractedTime };
};
</script>

<template lang="pug">
.page
    PageTitle(title="Prenotazioni")
    div.flex.items-center.py-4.border-b(v-for="item in reservations", :key="item.id")
        p {{ item.name }}
        p [# {{ item.id }}]
        .flex
            SVGIcon.text-primary-100(svg="users-filled", :size="20")
            p {{ formatDateAndTime(item.date).extractedDate }} <!-- Display extracted date -->

        .flex
            SVGIcon.text-grey-100(svg="clock", :size="20")
            p {{ formatDateAndTime(item.date).extractedTime }} <!-- Display extracted date -->

</template>
