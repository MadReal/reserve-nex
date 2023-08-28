const URL = "/api/restaurants";

import { useModalsStore } from "~/stores/Modals";

export const useRestaurantsStore = defineStore(
	"RestaurantsStore",
	() => {
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

		async function addOrUpdateRestaurant(
			restaurantName: Restaurant["name"],
			restaurantId: Restaurant["id"] | null
		) {
			const storeModals = useModalsStore();

			if (restaurantId) {
				await useFetch(`${URL}/${restaurantId}`, {
					method: "patch",
					body: { name: restaurantName },
				});
				const restuarantToUpdateIndex = restaurantsList.value.findIndex(
					(e) => e.id === restaurantId
				);
				restaurantsList.value[restuarantToUpdateIndex].name = restaurantName;
			} else {
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
		}

		async function removeRestaurant(restaurantId: Restaurant["id"]) {
			await useFetch(`${URL}/${restaurantId}`, { method: "delete" });
			const RestaurantToRemoveIndex = restaurantsList.value.findIndex(
				(e) => e.id === restaurantId
			);
			restaurantsList.value.splice(RestaurantToRemoveIndex, 1);
			// set another Active Restaurant // TODO; redirect if there are no more
			activeRestaurantId.value = restaurantsList.value[0].id;
		}

		return {
			restaurantsList,
			activeRestaurantId,
			activeRestaurant,
			switchActiveResturant,
			fetchRestaurants,
			addOrUpdateRestaurant,
			removeRestaurant,
		};
	},
	{
		persist: { storage: persistedState.localStorage },
	}
);

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useRestaurantsStore, import.meta.hot));
}
