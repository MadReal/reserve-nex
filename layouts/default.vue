<template lang="pug">
.view.grid(class="grid-cols-[250px_1fr]")
    Sidebar
    div
        Navbar
        ClientOnly
            <slot />
</template>

<script setup lang="ts">

</script>
