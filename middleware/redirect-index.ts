import { useRoute } from "vue-router";

export default defineNuxtRouteMiddleware(() => {
	const route = useRoute();

	if (/^\/admin\/?$/.test(route.path)) {
		return navigateTo("/admin/reservations");
	}
});
