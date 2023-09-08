import { storeToRefs } from "pinia";
import { useRestaurantsStore } from "@/stores/Restaurants";

export default defineNuxtRouteMiddleware(() => {
	const storeRestaurants = useRestaurantsStore();
	const { activeRestaurantId, restaurantsList } = storeToRefs(storeRestaurants);

	if (!restaurantsList.value || restaurantsList.value.length === 0 || !activeRestaurantId.value)
		return navigateTo("/admin/restaurants");
});
