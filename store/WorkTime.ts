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

	// ACTIONS
	const fetchWorkTimes = async () => {
		try {
			const { data, error }: any = await useFetch("/api/work-times");
			if (data.value) workTimesList.value = data.value;
		} catch (error) {
			console.error(error);
		}
	};
	const addNewWorkTime = async (
		newTime: WorkTime["time"],
		isLunch: boolean
	) => {
		try {
			const { data, error } = await useFetch("/api/work-times", {
				method: "post",
				body: {
					mealType: isLunch ? "LUNCH" : "DINNER",
					time: newTime,
					restaurantId: 1,
				},
			});
			if (data && data.value) workTimesList.value.push(data.value);
		} catch (error) {
			console.error(error);
		}
	};
	async function removeWorkTime(timeId: WorkTime["id"]) {
		try {
			await useFetch(`/api/work-times/${timeId}`, { method: "delete" });
			const workTimeIndex = workTimesList.value.findIndex(
				(e) => e.id === timeId
			);
			workTimesList.value.splice(workTimeIndex, 1);
		} catch (error) {
			console.error(error);
		}
	}

	return {
		workTimesList,
		lunchWorkTimesList,
		dinnerWorkTimesList,
		fetchWorkTimes,
		addNewWorkTime,
		removeWorkTime,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useWorkTimesStore, import.meta.hot));
}
