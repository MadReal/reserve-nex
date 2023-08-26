const URL = "/api/restaurants";

import { useModalsStore } from "~/store/Modals";

export const useRestaurantsStore = defineStore("RestaurantsStore", () => {
	// STATE
	const restaurantsList = ref<Restaurant[]>([]);
	let activeRestaurantId = ref<Restaurant["id"]>();

	// GETTERS
	const activeRestaurant = computed(
		() =>
			restaurantsList.value.filter(
				(item) => item.id === activeRestaurantId.value
			)[0]
	);

	// ACTIONS
	function switchActiveResturant(newId: number) {
		return (activeRestaurantId.value = newId);
	}

	async function fetchRestaurants() {
		const { data, error }: any = await useFetch(URL);
		if (data?.value) restaurantsList.value = data.value;
		// set active restaurant automatically if only 1 in the list
		if (data?.value.length === 1) activeRestaurantId.value = data.value[0].id;
	}

	async function addRestaurant(restaurantName: Restaurant["name"]) {
		const storeModals = useModalsStore();

		const { data, error } = await useFetch(URL, {
			method: "post",
			body: { name: restaurantName },
		});
		if (data && data.value) {
			restaurantsList.value.push(data.value);
			activeRestaurantId.value = data.value.id;
			storeModals.closeModal();
		}
	}

	async function removeRestaurant(restaurantId: Restaurant["id"]) {
		await useFetch(`${URL}/${restaurantId}`, { method: "delete" });
		const RestaurantToRemoveIndex = restaurantsList.value.findIndex(
			(e) => e.id === restaurantId
		);
		restaurantsList.value.splice(RestaurantToRemoveIndex, 1);
	}

	return {
		restaurantsList,
		activeRestaurantId,
		activeRestaurant,
		switchActiveResturant,
		fetchRestaurants,
		addRestaurant,
		removeRestaurant,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useRestaurantsStore, import.meta.hot));
}
