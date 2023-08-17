<template lang="pug">
.view(:class="`view--${routeName}`")
    Navbar
    <slot />
    Footer(:sm="routeName === 'contact'")
    .custom-cursor(:class="`custom-cursor--${routeName}`")
</template>

<script setup lang="ts">
const route = useRoute();

const routeName = computed(() => {
    const { cleanedRouteName } = useCleanRouteName(route.name?.toString() || '')

    switch (cleanedRouteName) {
        case 'index':
            return 'home';
        default:
            return cleanedRouteName;
    }
});

// cursor bubble effect
const mouseX = ref(0);
const mouseY = ref(0);
const cursorX = ref(0);
const cursorY = ref(0);
const easingFactor = 0.3; // Adjust the easing factor as desired

onMounted(() => {
    document.addEventListener('mousemove', handleMouseMove);
    requestAnimationFrame(updateCursor);
});

const handleMouseMove = (e: MouseEvent) => {
    mouseX.value = e.pageX;
    mouseY.value = e.pageY;
};

const updateCursor = () => {
    const cursor = document.querySelector('.custom-cursor') as HTMLElement;
    const dx = mouseX.value - cursorX.value;
    const dy = mouseY.value - cursorY.value;
    cursorX.value += dx * easingFactor;
    cursorY.value += dy * easingFactor;
    cursor.style.left = `${cursorX.value}px`;
    cursor.style.top = `${cursorY.value}px`;
    requestAnimationFrame(updateCursor);
};
</script>
