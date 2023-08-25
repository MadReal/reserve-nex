const URL = "/api/restaurants";

export const useRestaurantsStore = defineStore("RestaurantsStore", () => {
	// STATE
	const restaurantsList = ref<Restaurant[]>([]);
	let activeRestaurantId = ref<Restaurant["id"]>();

	// GETTERS
	const activeRestaurant = computed(() =>
		restaurantsList.value.filter((item) => item.id === activeRestaurantId.value)
	);

	// ACTIONS
	function switchActiveResturant(newId: number) {
		activeRestaurantId.value = newId;
	}

	async function fetchRestaurants() {
		const { data, error }: any = await useFetch(URL);
		if (data && data.value) restaurantsList.value = data.value;
		// set active restaurant automatically if only 1 in the list
		if (data?.value.length === 1) activeRestaurantId = data.value[0].id;
	}

	async function addRestaurant(restaurant: Restaurant) {
		const { data, error } = await useFetch(URL, {
			method: "post",
			body: { name: restaurant.name },
		});
		if (data && data.value) restaurantsList.value.push(data.value);
	}

	return {
		restaurantsList,
		activeRestaurantId,
		activeRestaurant,
		switchActiveResturant,
		fetchRestaurants,
		addRestaurant,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useRestaurantsStore, import.meta.hot));
}
