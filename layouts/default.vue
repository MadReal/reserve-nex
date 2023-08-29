<template lang="pug">
.view.lg_grid(class="lg_grid-cols-[250px_1fr]")
	Sidebar
	div
		Navbar
		<slot />
</template>