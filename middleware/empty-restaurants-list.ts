import { storeToRefs } from "pinia";
import { useRestaurantsStore } from "@/stores/Restaurants";

export default defineNuxtRouteMiddleware(() => {
	const storeRestaurants = useRestaurantsStore();
	const { restaurantsList } = storeToRefs(storeRestaurants);

	if (!restaurantsList.value.length) return navigateTo("/admin/restaurants");
});
