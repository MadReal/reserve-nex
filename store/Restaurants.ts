const URL = "/api/restaurants";

export const useRestaurantsStore = defineStore("RestaurantsStore", () => {
	// STATE
	const restaurantsList = ref<Reservation[]>([]);

	// GETTERS

	// ACTIONS
	async function fetchRestaurants() {
		const { data, error }: any = await useFetch(URL);
		if (data && data.value) restaurantsList.value = data.value;
	}

	return {
		restaurantsList,
		fetchRestaurants,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useRestaurantsStore, import.meta.hot));
}
