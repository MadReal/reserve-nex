<template lang="pug">
.view.lg_grid(class="lg_grid-cols-[250px_1fr]")
	AdminSidebar
	div
		AdminNavbar
		<slot />
</template>