import { useRestaurantsStore } from "~/stores/Restaurants";

export function useSwitchActiveRestaurant() {
	const storeRestaurants = useRestaurantsStore();

	function switchActiveRestaurant(restaurantId: Restaurant["id"]) {
		// @ts-ignore
		storeRestaurants.switchActiveResturant(restaurantId);
		navigateTo("/admin/reservations");
	}

	return {
		switchActiveRestaurant,
	};
}
