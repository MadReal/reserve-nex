// useLoadAllData.ts (Composable)
import { useRestaurantsStore } from "~/stores/Restaurants";
import { useWorkTimesStore } from "~/stores/WorkTimes";
import { useReservationsStore } from "~/stores/Reservations";

export function useLoadAllData() {
	const storeRestaurants = useRestaurantsStore();
	const storeWorkTimes = useWorkTimesStore();
	const storeReservations = useReservationsStore();

	function loadAllData() {
		storeRestaurants.fetchRestaurants();
		storeWorkTimes.fetchWorkTimes();
		storeReservations.fetchReservations();
	}

	return { loadAllData };
}
