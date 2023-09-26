const URL = "/api/work-times";

import { storeToRefs } from "pinia";

export const useWorkTimesStore = defineStore("WorkTimesStore", () => {

	const storeNotifications = useNotificationsStore();
	const storeRestaurants = useRestaurantsStore();
	const { activeRestaurantId } = storeToRefs(storeRestaurants);
	const storeAuth = useAuthStore();
	const { authToken } = storeToRefs(storeAuth);

	// STATE
	const workTimesList = ref<WorkTime[]>([]);

	// GETTERS
	const lunchWorkTimesList = computed(() =>
		useSortWorkTimes(
			workTimesList.value.filter((item: WorkTime) => item.mealType === "LUNCH")
		)
	);
	const dinnerWorkTimesList = computed(() =>
		useSortWorkTimes(
			workTimesList.value.filter((item: WorkTime) => item.mealType === "DINNER")
		)
	);

	const workTimesListsMerged = computed(() =>
		useSortWorkTimes(lunchWorkTimesList.value.concat(dinnerWorkTimesList.value))
	);

	// ACTIONS
	async function fetchWorkTimes(restaurantId?: Restaurant["id"]) {
		const { data, error } = await useFetch<WorkTime[]>(URL, {
			params: { restaurantId: activeRestaurantId.value || restaurantId },
		});
		if (data.value) workTimesList.value = data.value;
		else if (error) throw error.value
	}

	async function addNewWorkTime(newTime: WorkTime["time"], isLunch: boolean) {
		const { data, error } = await useFetch<WorkTime>(URL, {
			method: "post",
			headers: { Authorization: authToken.value ? `Bearer ${authToken.value}` : '' },
			body: {
				mealType: isLunch ? "LUNCH" : "DINNER",
				time: newTime,
				restaurantId: activeRestaurantId.value,
			},
		});
		if (data && data.value) workTimesList.value.push(data.value);
		else if (error) throw error.value
	}

	async function removeWorkTime(timeId: WorkTime["id"]) {
		const { status } = await useFetch(`${URL}/${timeId}`, { method: "delete", headers: { Authorization: authToken.value ? `Bearer ${authToken.value}` : '' }, });
		if (status.value === 'error') return storeNotifications.openNotification("Errore nell'eliminazione, riprova più tardi.", false)

		const workTimeIndex = workTimesList.value.findIndex((e) => e.id === timeId);
		workTimesList.value.splice(workTimeIndex, 1);
	}

	return {
		workTimesList,
		lunchWorkTimesList,
		dinnerWorkTimesList,
		workTimesListsMerged,
		fetchWorkTimes,
		addNewWorkTime,
		removeWorkTime,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useWorkTimesStore, import.meta.hot));
}
