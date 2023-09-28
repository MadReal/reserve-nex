const URL_BLOCK = "/api/block";
const URL_BLOCKED_DATE = `${URL_BLOCK}/dates`;
const URL_BLOCKED_DAY_OF_WEEK = `${URL_BLOCK}/days-of-week`;
const URL_BLOCKED_TIME_RANGE_ON_DATE = `${URL_BLOCK}/time-range-on-date`;
const URL_BLOCKED_TIME_RANGE_ON_DAY_OF_WEEK = `${URL_BLOCK}/time-range-on-day-of-week`;

import { storeToRefs } from "pinia";

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

	const storeNotifications = useNotificationsStore();
	const storeRestaurants = useRestaurantsStore();
	const { activeRestaurantId } = storeToRefs(storeRestaurants);
	const storeAuth = useAuthStore();
	const { authToken } = storeToRefs(storeAuth);

	// STATE - Block 'Dates' (One (or more) days period, vacation)
	const blockedDatesList = ref<Block[]>([]);
	// STATE - Block 'dayOfWeek'
	const blockedDaysOfWeekList = ref<Block[]>([]);
	// STATE - Block - 'Time Range On Day Of Week'
	const blockedTimeRangeOnDayOfWeekList = ref<Block[]>([]);
	// STATE - Block - 'Time Range On Date'
	const blockedTimeRangeOnDateList = ref<Block[]>([]);

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
		const restaurantId = activeRestaurantId.value
		const { data, error } = await useFetch<Block>(URL_BLOCKED_DATE, {
			method: "post",
			headers: { Authorization: authToken.value ? `Bearer ${authToken.value}` : '' },
			body: { dateStart, dateEnd, periodTitle, restaurantId }
		});
		if (data && data.value) {
			blockedDatesList.value.push(data.value);
			// return data.value
		}
		else if (error) {
			storeNotifications.openNotification("Errore nell'aggiunta del blocco, riprova più tardi.", false)
			throw error.value
		}
	}

	async function updateBlockedDate(blockId: Block["id"], dateStart: Block["dateStart"], dateEnd: Block["dateEnd"]) {
		const { data, error } = await useFetch<Block>(`${URL_BLOCKED_DATE}/${blockId}`, {
			method: "patch",
			headers: { Authorization: authToken.value ? `Bearer ${authToken.value}` : '' },
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
		else if (error) {
			storeNotifications.openNotification("Errore nell'eseguire questa azione, riprova più tardi.", false)
			throw error.value
		}
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
				headers: { Authorization: authToken.value ? `Bearer ${authToken.value}` : '' },
				body: { dayOfWeek: newDayOfWeek, restaurantId: activeRestaurantId.value },
			});
			if (data && data.value) {
				const blockedDayOfWeekToUpdateIndex = blockedDaysOfWeekList.value.findIndex((e) => e.id === oldDayOfWeekId);
				blockedDaysOfWeekList.value[blockedDayOfWeekToUpdateIndex].dayOfWeek = newDayOfWeek;
			}
			else if (error) {
				storeNotifications.openNotification("Errore nell'eseguire questa azione, riprova più tardi.", false)
				throw error.value
			}
		} else {
			const { data, error } = await useFetch<Block>(URL_BLOCKED_DAY_OF_WEEK, {
				method: "post",
				headers: { Authorization: authToken.value ? `Bearer ${authToken.value}` : '' },
				body: { dayOfWeek: newDayOfWeek, restaurantId: activeRestaurantId.value },
			});
			if (data && data.value) {
				// push inside
				blockedDaysOfWeekList.value.push(data.value);
				// re-order
				blockedDaysOfWeekList.value = sortblockedDaysOfWeek(blockedDaysOfWeekList.value);
			}
			else if (error) {
				storeNotifications.openNotification("Errore nell'aggiunta del blocco, riprova più tardi.", false)
				throw error.value
			}
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
		const { data, error } = await useFetch<Block>(URL_BLOCKED_TIME_RANGE_ON_DATE, { method: "post", headers: { Authorization: authToken.value ? `Bearer ${authToken.value}` : '' }, body: blockedTimeOnDay, });
		if (data.value) blockedTimeRangeOnDateList.value.push(data.value);
		else if (error) {
			storeNotifications.openNotification("Errore nell'aggiunta del blocco, riprova più tardi.", false)
			throw error.value
		}
	}

	async function updateBlockedTimeRangeOnDate(blockId: Block["id"], timeStart: Block["timeStart"], timeEnd: Block["timeEnd"], date: Block["date"]) {
		const blockedTimeOnDay = { timeStart, timeEnd, date, restaurantId: activeRestaurantId.value, };

		const { data, error } = await useFetch<Block>(`${URL_BLOCKED_TIME_RANGE_ON_DATE}/${blockId}`, { method: "patch", headers: { Authorization: authToken.value ? `Bearer ${authToken.value}` : '' }, body: blockedTimeOnDay, });
		if (data.value) {
			const blockTimePeriodToUpdateIndex = blockedTimeRangeOnDateList.value.findIndex((e) => e.id === blockId);
			const newBlockTimePeriod = { ...blockedTimeRangeOnDateList.value[blockTimePeriodToUpdateIndex], timeStart, timeEnd, date };
			blockedTimeRangeOnDateList.value[blockTimePeriodToUpdateIndex] = newBlockTimePeriod;
		}
		else if (error) {
			storeNotifications.openNotification("Errore nell'eseguire questa azione, riprova più tardi.", false)
			throw error.value
		}
	}

	// ***********************************
	// ACTIONS - Block - 'Time Range On Day Of Week'
	// ***********************************
	async function fetchBlockedTimeRangeOnDayOfWeek(restaurantId?: Restaurant["id"]) {
		const { data, error }: any = await useFetch<Block[]>(URL_BLOCKED_TIME_RANGE_ON_DAY_OF_WEEK, { params: { restaurantId: restaurantId || activeRestaurantId.value }, });
		if (data.value) {
			const sortedBlocks = data.value.sort((a: Block, b: Block) => a.dayOfWeek! - b.dayOfWeek!);
			blockedTimeRangeOnDayOfWeekList.value = sortedBlocks;
		}
		else if (error) throw error.value
	}

	async function addBlockedTimeRangeOnDayOfWeek(timeStart: Block["timeStart"], timeEnd: Block["timeEnd"]) {
		const daysOfWeek = [1, 2, 3, 4, 5, 6, 7]
		const availableDayOfWeek = daysOfWeek.filter(day => !blockedTimeRangeOnDayOfWeekList.value.some(item => item.dayOfWeek === day)
		);
		if (availableDayOfWeek[0]) {
			const block = { timeStart, timeEnd, dayOfWeek: availableDayOfWeek[0], restaurantId: activeRestaurantId.value };
			const { data, error } = await useFetch<Block>(URL_BLOCKED_TIME_RANGE_ON_DAY_OF_WEEK, { method: "post", headers: { Authorization: authToken.value ? `Bearer ${authToken.value}` : '' }, body: block, });
			if (data.value) blockedTimeRangeOnDayOfWeekList.value.push(data.value);
			else if (error) {
				storeNotifications.openNotification("Errore nell'aggiunta del blocco, riprova più tardi.", false)
				throw error.value
			}
		} else return
	}

	async function updateBlockedTimeRangeOnDayOfWeek(blockId: Block["id"], timeStart: Block["timeStart"], timeEnd: Block["timeEnd"], dayOfWeek: Block["dayOfWeek"]) {
		const block = { timeStart, timeEnd, dayOfWeek, restaurantId: activeRestaurantId.value };

		const { data, error } = await useFetch<Block>(`${URL_BLOCKED_TIME_RANGE_ON_DAY_OF_WEEK}/${blockId}`, { method: "patch", headers: { Authorization: authToken.value ? `Bearer ${authToken.value}` : '' }, body: block, });
		if (data.value) {
			const blockToUpdateIndex = blockedTimeRangeOnDayOfWeekList.value.findIndex((e) => e.id === blockId);
			const newBlock = { ...blockedTimeRangeOnDayOfWeekList.value[blockToUpdateIndex], timeStart, timeEnd, dayOfWeek };
			blockedTimeRangeOnDayOfWeekList.value[blockToUpdateIndex] = newBlock;
		}
		else if (error) {
			storeNotifications.openNotification("Errore nell'eseguire questa azione, riprova più tardi.", false)
			throw error.value
		}
	}

	// ***********************************
	// ACTIONS - Block - ALL
	// ***********************************
	async function removeBlock(blockId: Block["id"]) {
		const { status } = await useFetch(`${URL_BLOCK}/${blockId}`, { method: "delete", headers: { Authorization: authToken.value ? `Bearer ${authToken.value}` : '' }, });
		if (status.value === 'error') return storeNotifications.openNotification("Errore nell'eliminazione, riprova più tardi.", false)
		// try to find the index in each state, remove the one that works

		// blockedDaysOfWeekList
		const blockedDayOfWeekToRemoveIndex = blockedDaysOfWeekList.value.findIndex((e) => e.id === blockId);
		if (blockedDayOfWeekToRemoveIndex !== -1) blockedDaysOfWeekList.value.splice(blockedDayOfWeekToRemoveIndex, 1);

		// blockedDatesList
		const blockedDateToRemoveIndex = blockedDatesList.value.findIndex((e) => e.id === blockId);
		if (blockedDateToRemoveIndex !== -1) blockedDatesList.value.splice(blockedDateToRemoveIndex, 1);

		// blockedTimeRangeOnDateList
		const blockedTimeRangeOnDateToRemoveIndex = blockedTimeRangeOnDateList.value.findIndex((e) => e.id === blockId);
		if (blockedTimeRangeOnDateToRemoveIndex !== -1) blockedTimeRangeOnDateList.value.splice(blockedTimeRangeOnDateToRemoveIndex, 1);

		// blockedTimeRangeOnDayOfWeekList
		const blockedTimeRangeOnDayOfWeekToRemoveIndex = blockedTimeRangeOnDayOfWeekList.value.findIndex((e) => e.id === blockId);
		if (blockedTimeRangeOnDayOfWeekToRemoveIndex !== -1) blockedTimeRangeOnDayOfWeekList.value.splice(blockedTimeRangeOnDayOfWeekToRemoveIndex, 1);
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
		// Block - 'Time Range On Date'
		blockedTimeRangeOnDateList,
		fetchBlockedTimeRangeOnDate,
		addBlockedTimeRangeOnDate,
		updateBlockedTimeRangeOnDate,
		// Block - 'Time Range On DayOfWeel'
		blockedTimeRangeOnDayOfWeekList,
		fetchBlockedTimeRangeOnDayOfWeek,
		addBlockedTimeRangeOnDayOfWeek,
		updateBlockedTimeRangeOnDayOfWeek,
		// Block - All
		removeBlock,
	};
});

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useBlocksStore, import.meta.hot));