const URL = "/api/work-times";

export const useWorkTimesStore = defineStore("WorkTimesStore", () => {
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
	async function fetchWorkTimes() {
		const { data, error }: any = await useFetch(URL);
		if (data.value) workTimesList.value = data.value;
	}

	async function addNewWorkTime(newTime: WorkTime["time"], isLunch: boolean) {
		const { data, error } = await useFetch(URL, {
			method: "post",
			body: {
				mealType: isLunch ? "LUNCH" : "DINNER",
				time: newTime,
				restaurantId: 1,
			},
		});
		if (data && data.value) workTimesList.value.push(data.value);
	}

	async function removeWorkTime(timeId: WorkTime["id"]) {
		await useFetch(`${URL}/${timeId}`, { method: "delete" });
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