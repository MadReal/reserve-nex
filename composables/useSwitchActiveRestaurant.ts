import { useRestaurantsStore } from "~/stores/Restaurants";

export function useSwitchActiveRestaurant() {
	const storeRestaurants = useRestaurantsStore();

	function switchActiveRestaurant(restaurantId: Restaurant["id"]) {
		storeRestaurants.switchActiveResturant(restaurantId);
		navigateTo("/admin/reservations");
	}

	return {
		switchActiveRestaurant,
	};
}
