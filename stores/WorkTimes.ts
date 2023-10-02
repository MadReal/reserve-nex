const URL = "/api/work-times";

import { storeToRefs } from "pinia";

// Shared filtering function for time range
function filterByTimeRange(items: WorkTime[], startTime: number, endTime: number): WorkTime[] {
	return items.filter((item) => {
		const [hour, minute] = item.time.split(":").map(Number);
		const timeValue = hour * 60 + minute; // Convert time to minutes for comparison
		return timeValue >= (startTime * 60) && timeValue <= (endTime * 60);
	});
}

export const useWorkTimesStore = defineStore("WorkTimesStore", () => {

	const storeNotifications = useNotificationsStore();
	const storeRestaurants = useRestaurantsStore();
	const { activeRestaurantId } = storeToRefs(storeRestaurants);
	const storeAuth = useAuthStore();
	const { authToken } = storeToRefs(storeAuth);

	// STATE
	const workTimesList = ref<WorkTime[]>([]);


	// GETTERS
	const lunchWorkTimesList = computed(() => useSortWorkTimes(filterByTimeRange(workTimesList.value, 0, 16.5))); // from 00:00 until 16:30
	const dinnerWorkTimesList = computed(() => useSortWorkTimes(filterByTimeRange(workTimesList.value, 17, 23.5))); // from 17:00 until 23:30
	const workTimesListsSorted = computed(() => useSortWorkTimes(workTimesList.value));


	// ACTIONS
	async function fetchWorkTimes(restaurantId?: Restaurant["id"]) {
		const { data, error } = await useFetch<WorkTime[]>(URL, { params: { restaurantId: activeRestaurantId.value || restaurantId } });
		if (data.value) workTimesList.value = data.value;
		else if (error) throw error.value
	}

	async function addNewWorkTime(newTime: WorkTime["time"]) {
		const { data, error } = await useFetch<WorkTime>(URL, {
			method: "post",
			headers: { Authorization: authToken.value ? `Bearer ${authToken.value}` : '' },
			body: { time: newTime, restaurantId: activeRestaurantId.value }
		});
		if (data && data.value) workTimesList.value.push(data.value);
		else if (error) {
			storeNotifications.openNotification('', false)
			throw error.value
		}
	}

	async function removeWorkTime(timeId: WorkTime["id"]) {
		const { status } = await useFetch(`${URL}/${timeId}`, { method: "delete", headers: { Authorization: authToken.value ? `Bearer ${authToken.value}` : '' }, });
		if (status.value === 'error') return storeNotifications.openNotification('', false)

		const workTimeIndex = workTimesList.value.findIndex((e) => e.id === timeId);
		workTimesList.value.splice(workTimeIndex, 1);
	}

	return {
		workTimesList,
		lunchWorkTimesList,
		dinnerWorkTimesList,
		workTimesListsSorted,
		fetchWorkTimes,
		addNewWorkTime,
		removeWorkTime,
	};
});

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useWorkTimesStore, import.meta.hot));