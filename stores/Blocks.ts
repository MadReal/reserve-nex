import { storeToRefs } from "pinia";
import { useRestaurantsStore } from "~/stores/Restaurants";

const URL_BLOCK = "/api/block";
const URL_BLOCKED_DATE = `${URL_BLOCK}/dates`;
const URL_BLOCKED_DAY_OF_WEEK = `${URL_BLOCK}/days-of-week`;
const URL_BLOCKED_TIME_RANGE_ON_DATE = `${URL_BLOCK}/time-range-on-date`;
const URL_BLOCKED_TIME_RANGE_ON_DAY_OF_WEEK = `${URL_BLOCK}/time-range-on-day-of-week`;

// Sort week days ascendent (Monday, Tuesday)
function sortblockedDaysOfWeek(array: Block[]) {
	return array.slice().sort((a: Block, b: Block) => {
		if (a.dayOfWeek === null && b.dayOfWeek === null) return 0;
		if (a.dayOfWeek === null) return 1;
		if (b.dayOfWeek === null) return -1;
		return a.dayOfWeek - b.dayOfWeek;
	});
}

export const useBlocksStore = defineStore("BlocksStore", () => {
	const storeRestaurants = useRestaurantsStore();
	const { activeRestaurantId } = storeToRefs(storeRestaurants);

	// STATE - Block 'Dates' (One (or more) days period, vacation)
	const blockedDatesList = ref<Block[]>([]);
	// STATE - Block 'dayOfWeek'
	const blockedDaysOfWeekList = ref<Block[]>([]);
	// STATE - Block - 'Time Range On Date'
	const blockedTimeRangeOnDateList = ref<Block[]>([]);
	// STATE - Block - 'Time Range On Date'
	const blockedTimeRangeOnDayOfWeekList = ref<Block[]>([]);

	// GETTERS - Block - 'One (or more) days period'
	const blockedDatesListFullCalendar = computed(() =>
		blockedDatesList.value.map((item) => ({
			...item,
			start: item.dateStart,
			end: item.dateEnd,
			title: item.periodTitle,
			allDay: true,
		}))
	);

	// ***********************************
	// ACTIONS - Block 'Dates' (One (or more) days period, vacation)
	// ***********************************
	async function fetchBlockedDates(restaurantId?: Restaurant["id"]) {
		const { data, error }: any = await useFetch<Block[]>(URL_BLOCKED_DATE, {
			params: { restaurantId: restaurantId || activeRestaurantId.value },
		});
		if (data && data.value) blockedDatesList.value = data.value;
		else if (error) throw error.value
	}

	async function addBlockedDate(dateStart: Block["dateStart"], dateEnd: Block["dateEnd"], periodTitle: Block["periodTitle"]) {
		const { data, error } = await useFetch<Block>(URL_BLOCKED_DATE, {
			method: "post",
			body: {
				dateStart,
				dateEnd,
				periodTitle,
				restaurantId: activeRestaurantId.value,
			},
		});
		if (data && data.value) blockedDatesList.value.push(data.value);
		else if (error) throw error.value
	}

	async function updateBlockedDate(blockId: Block["id"], dateStart: Block["dateStart"], dateEnd: Block["dateEnd"]) {
		const { data, error } = await useFetch<Block>(`${URL_BLOCKED_DATE}/${blockId}`, {
			method: "patch",
			body: { dateStart, dateEnd },
		});
		if (data && data.value) {
			const blockedDateToUpdateIndex = blockedDatesList.value.findIndex((e) => e.id === blockId
			);
			if (blockedDateToUpdateIndex !== -1) {
				blockedDatesList.value[blockedDateToUpdateIndex].dateStart = dateStart;
				blockedDatesList.value[blockedDateToUpdateIndex].dateEnd = dateEnd;
			}
		}
		else if (error) throw error.value
	}

	// ***********************************
	// ACTIONS - Block 'dayOfWeek'
	// ***********************************
	async function fetchBlockedDaysOfWeek(restaurantId?: Restaurant["id"]) {
		const { data, error } = await useFetch<Block[]>(URL_BLOCKED_DAY_OF_WEEK, {
			params: { restaurantId: restaurantId || activeRestaurantId.value },
		});
		if (data && data.value) blockedDaysOfWeekList.value = sortblockedDaysOfWeek(data.value);
		else if (error) throw error.value

	}

	async function addOrUpdateBlockedDayOfWeek(oldDayOfWeekId: Block["id"], newDayOfWeek: Block["dayOfWeek"], isUpdate: boolean) {
		if (isUpdate) {
			const { data, error } = await useFetch<Block>(`${URL_BLOCKED_DAY_OF_WEEK}/${oldDayOfWeekId}`, {
				method: "patch",
				body: { dayOfWeek: newDayOfWeek, restaurantId: activeRestaurantId.value },
			});
			if (data && data.value) {
				const blockedDayOfWeekToUpdateIndex = blockedDaysOfWeekList.value.findIndex((e) => e.id === oldDayOfWeekId);
				blockedDaysOfWeekList.value[blockedDayOfWeekToUpdateIndex].dayOfWeek = newDayOfWeek;
			}
			else if (error) throw error.value
		} else {
			const { data, error } = await useFetch<Block>(URL_BLOCKED_DAY_OF_WEEK, {
				method: "post",
				body: { dayOfWeek: newDayOfWeek, restaurantId: activeRestaurantId.value },
			});
			if (data && data.value) {
				// push inside
				blockedDaysOfWeekList.value.push(data.value);
				// re-order
				blockedDaysOfWeekList.value = sortblockedDaysOfWeek(blockedDaysOfWeekList.value);
			}
			else if (error) throw error.value
		}
	}

	// ***********************************
	// ACTIONS - Block - 'Time Range On Date'
	// ***********************************
	async function fetchBlockedTimeRangeOnDate(restaurantId?: Restaurant["id"]) {
		const { data, error }: any = await useFetch<Block[]>(URL_BLOCKED_TIME_RANGE_ON_DATE, { params: { restaurantId: restaurantId || activeRestaurantId.value }, });
		if (data.value) {
			const sortedBlocks = data.value.sort((a: Block, b: Block) => new Date(a.date!).getTime() - new Date(b.date!).getTime());
			blockedTimeRangeOnDateList.value = sortedBlocks;
		}
		else if (error) throw error.value
	}

	async function addBlockedTimeRangeOnDate(timeStart: Block["timeStart"], timeEnd: Block["timeEnd"]) {
		const todayMidnight = new Date();
		todayMidnight.setUTCHours(0, 0, 0, 0);

		const blockedTimeOnDay = { timeStart, timeEnd, date: todayMidnight, restaurantId: activeRestaurantId.value };
		const { data, error } = await useFetch<Block>(URL_BLOCKED_TIME_RANGE_ON_DATE, { method: "post", body: blockedTimeOnDay, });
		if (data.value) blockedTimeRangeOnDateList.value.push(data.value);
		else if (error) throw error.value
	}

	async function updateBlockedTimeRangeOnDate(blockId: Block["id"], timeStart: Block["timeStart"], timeEnd: Block["timeEnd"], date: Block["date"]) {
		const blockedTimeOnDay = { timeStart, timeEnd, date, restaurantId: activeRestaurantId.value, };

		const { data, error } = await useFetch<Block>(`${URL_BLOCKED_TIME_RANGE_ON_DATE}/${blockId}`, { method: "patch", body: blockedTimeOnDay, });
		if (data.value) {
			const blockTimePeriodToUpdateIndex = blockedTimeRangeOnDateList.value.findIndex((e) => e.id === blockId);
			const newBlockTimePeriod = { ...blockedTimeRangeOnDateList.value[blockTimePeriodToUpdateIndex], timeStart, timeEnd, date };
			blockedTimeRangeOnDateList.value[blockTimePeriodToUpdateIndex] = newBlockTimePeriod;
		}
		else if (error) throw error.value
	}

	// ***********************************
	// ACTIONS - Block - 'Time Range On Date'
	// ***********************************
	async function fetchBlockedTimeRangeOnDayOfWeek(restaurantId?: Restaurant["id"]) {
		const { data, error }: any = await useFetch<Block[]>(URL_BLOCKED_TIME_RANGE_ON_DAY_OF_WEEK, { params: { restaurantId: restaurantId || activeRestaurantId.value }, });
		if (data.value) {
			const sortedBlocks = data.value.sort((a: Block, b: Block) => a.dayOfWeek! - b.dayOfWeek!);
			blockedTimeRangeOnDayOfWeekList.value = sortedBlocks;
		}
		else if (error) throw error.value
	}

	// ***********************************
	// ACTIONS - Block - ALL
	// ***********************************
	async function removeBlock(blockId: Block["id"]) {
		await useFetch(`${URL_BLOCK}/${blockId}`, { method: "delete" });

		// try to find the index in each state, remove the one that works

		// blockedDaysOfWeekList
		const blockedDayOfWeekToRemoveIndex = blockedDaysOfWeekList.value.findIndex((e) => e.id === blockId);
		if (blockedDayOfWeekToRemoveIndex !== -1) blockedDaysOfWeekList.value.splice(blockedDayOfWeekToRemoveIndex, 1);

		// blockedTimeRangeOnDateList
		const blockedTimeOnDayToRemoveIndex = blockedTimeRangeOnDateList.value.findIndex((e) => e.id === blockId);
		if (blockedTimeOnDayToRemoveIndex !== -1) blockedTimeRangeOnDateList.value.splice(blockedTimeOnDayToRemoveIndex, 1);

		// blockedDatesList // TODO: this never gets it. I think it's the watch inside 'blocked-days'
		const blockedDateToRemoveIndex = blockedDatesList.value.findIndex((e) => e.id === blockId);
		if (blockedDateToRemoveIndex !== -1) blockedDatesList.value.splice(blockedDateToRemoveIndex, 1);
	}

	return {
		// Block - 'One (or more) days period'
		blockedDatesList,
		blockedDatesListFullCalendar,
		fetchBlockedDates,
		addBlockedDate,
		updateBlockedDate,
		// Block - 'dayOfWeek'
		blockedDaysOfWeekList,
		fetchBlockedDaysOfWeek,
		addOrUpdateBlockedDayOfWeek,
		// Block - 'Time Period On Date'
		blockedTimeRangeOnDateList,
		fetchBlockedTimeRangeOnDate,
		addBlockedTimeRangeOnDate,
		updateBlockedTimeRangeOnDate,
		// Block - 'Time Period On DayOfWeel'
		blockedTimeRangeOnDayOfWeekList,
		fetchBlockedTimeRangeOnDayOfWeek,
		// Block - All
		removeBlock,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useBlocksStore, import.meta.hot));
}
