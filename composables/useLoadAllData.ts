export function useLoadAllData() {
	const storeRestaurants = useRestaurantsStore();
	const storeReservations = useReservationsStore();
	const storeWorkTimes = useWorkTimesStore();

	function loadAdminInitData() {
		storeRestaurants.fetchRestaurants();
		storeReservations.fetchReservations();
		storeWorkTimes.fetchWorkTimes();
	}

	return { loadAdminInitData };
}
