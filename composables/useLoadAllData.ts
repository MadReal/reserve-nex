// useLoadAllData.ts (Composable)
import { useRestaurantsStore } from "~/stores/Restaurants";
import { useWorkTimesStore } from "~/stores/WorkTimes";
import { useReservationsStore } from "~/stores/Reservations";

export function useLoadAllData() {
	const storeRestaurants = useRestaurantsStore();
	const storeWorkTimes = useWorkTimesStore();
	const storeReservations = useReservationsStore();

	async function loadAllData() {
		await Promise.all([
			storeRestaurants.fetchRestaurants(),
			storeWorkTimes.fetchWorkTimes(),
			storeReservations.fetchReservations(),
		]);
	}

	return { loadAllData };
}
