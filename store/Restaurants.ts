const URL = "/api/restaurants";

export const useRestaurantsStore = defineStore("RestaurantsStore", () => {
	// STATE
	const restaurantsList = ref<Reservation[]>([]);

	// GETTERS

	// ACTIONS
	async function fetchRestaurants() {
		console.log("ef");

		const { data, error }: any = await useFetch(URL);
		console.log(data.value);

		if (data && data.value) restaurantsList.value = data.value;
		console.log(restaurantsList.value);
	}

	return {
		restaurantsList,
		fetchRestaurants,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useRestaurantsStore, import.meta.hot));
}
