<template lang="pug">
.view.view--admin.lg_grid(class="lg_grid-cols-[250px_1fr]")
	AdminSidebar
	div.page.page--admin
		AdminNavbar
		<slot />
</template>