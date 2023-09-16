<template lang="pug">
.view.view--admin.md_grid(class="md_grid-cols-[250px_1fr]")
	AdminSidebar
	div.page.page--admin
		AdminNavbar
		<slot />
</template>
