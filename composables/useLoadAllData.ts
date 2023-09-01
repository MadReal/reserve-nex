// useLoadAllData.ts (Composable)
import { useRestaurantsStore } from "~/stores/Restaurants";
import { useReservationsStore } from "~/stores/Reservations";
import { useWorkTimesStore } from "~/stores/WorkTimes";
import { useBlocksStore } from "~/stores/Blocks";

export function useLoadAllData() {
	const storeRestaurants = useRestaurantsStore();
	const storeReservations = useReservationsStore();
	const storeWorkTimes = useWorkTimesStore();
	const storeBlocks = useBlocksStore();

	function loadAdminInitData() {
		storeRestaurants.fetchRestaurants();
		storeReservations.fetchReservations();
		storeWorkTimes.fetchWorkTimes();
	}

	return { loadAdminInitData };
}
