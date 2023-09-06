import { storeToRefs } from "pinia";
import { useRestaurantsStore } from "~/stores/Restaurants";

const URL_block = "/api/block";
const URL_blockedDaysOfWeek = `${URL_block}/days-of-week`;
const URL_blockedTimesOnDay = `${URL_block}/times-on-day`;
const URL_blockedDate = `${URL_block}/dates`;

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

	// STATE - Block 'dayOfWeek'
	const blockedDaysOfWeekList = ref<Block[]>([]);
	// STATE - Block - 'Time Period On Date'
	const blockedTimesOnDayList = ref<Block[]>([]);
	// STATE - Block - 'One (or more) days period'
	const blockedDatesList = ref<Block[]>([]);

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

	// ACTIONS - Block 'dayOfWeek'
	async function fetchBlockedDaysOfWeek(restaurantId?: Restaurant["id"]) {
		const { data, error } = await useFetch<Block[]>(URL_blockedDaysOfWeek, {
			params: { restaurantId: restaurantId || activeRestaurantId },
		});
		if (data && data.value)
			blockedDaysOfWeekList.value = sortblockedDaysOfWeek(data.value);
	}

	async function addOrUpdateBlockedDayOfWeek(
		oldDayOfWeekId: Block["id"],
		newDayOfWeek: Block["dayOfWeek"],
		isUpdate: boolean
	) {
		if (isUpdate) {
			await useFetch<Block>(`${URL_blockedDaysOfWeek}/${oldDayOfWeekId}`, {
				method: "patch",
				body: { dayOfWeek: newDayOfWeek, restaurantId: activeRestaurantId },
			});
			const blockedDayOfWeekToUpdateIndex =
				blockedDaysOfWeekList.value.findIndex((e) => e.id === oldDayOfWeekId);
			blockedDaysOfWeekList.value[blockedDayOfWeekToUpdateIndex].dayOfWeek =
				newDayOfWeek;
		} else {
			const { data, error } = await useFetch<Block>(URL_blockedDaysOfWeek, {
				method: "post",
				body: { dayOfWeek: newDayOfWeek, restaurantId: activeRestaurantId },
			});
			if (data && data.value) {
				// push inside
				blockedDaysOfWeekList.value.push(data.value);
				// re-order
				blockedDaysOfWeekList.value = sortblockedDaysOfWeek(
					blockedDaysOfWeekList.value
				);
			}
		}
	}

	// ACTIONS - Block - 'Time Period On Date'
	async function fetchBlockedTimesOnDay(restaurantId?: Restaurant["id"]) {
		const { data, error }: any = await useFetch<Block[]>(
			URL_blockedTimesOnDay,
			{
				params: { restaurantId: restaurantId || activeRestaurantId },
			}
		);
		if (data.value) {
			const validBlocks = data.value.filter(
				(block: Block) => block.date !== null
			);
			const sortedBlocks = validBlocks
				.slice()
				.sort(
					(a: Block, b: Block) =>
						new Date(a.date!).getTime() - new Date(b.date!).getTime()
				);
			blockedTimesOnDayList.value = sortedBlocks;
		}
	}

	async function addBlockedTimeOnDay(
		timeStart: Block["timeStart"],
		timeEnd: Block["timeEnd"]
	) {
		const todayMidnight = new Date();
		todayMidnight.setUTCHours(0, 0, 0, 0);

		const blockedTimeOnDay = {
			timeStart,
			timeEnd,
			date: todayMidnight,
			restaurantId: activeRestaurantId,
		};
		const { data, error } = await useFetch<Block>(URL_blockedTimesOnDay, {
			method: "post",
			body: blockedTimeOnDay,
		});
		if (data.value) blockedTimesOnDayList.value.push(data.value);
	}

	async function updateBlockedTimeOnDay(
		blockId: Block["id"],
		timeStart: Block["timeStart"],
		timeEnd: Block["timeEnd"],
		date: Block["date"]
	) {
		const blockedTimeOnDay = {
			timeStart,
			timeEnd,
			date,
			restaurantId: activeRestaurantId,
		};

		await useFetch<Block>(`${URL_blockedTimesOnDay}/${blockId}`, {
			method: "patch",
			body: blockedTimeOnDay,
		});
		const blockTimePeriodToUpdateIndex = blockedTimesOnDayList.value.findIndex(
			(e) => e.id === blockId
		);
		const newBlockTimePeriod = {
			...blockedTimesOnDayList.value[blockTimePeriodToUpdateIndex],
			timeStart,
			timeEnd,
			date,
		};
		blockedTimesOnDayList.value[blockTimePeriodToUpdateIndex] =
			newBlockTimePeriod;
	}

	// ACTIONS - Block - 'One (or more) days period'
	async function fetchBlockedDates(restaurantId?: Restaurant["id"]) {
		const { data, error }: any = await useFetch<Block[]>(URL_blockedDate, {
			params: { restaurantId: restaurantId || activeRestaurantId },
		});
		if (data && data.value) blockedDatesList.value = data.value;
	}

	async function addBlockedDate(
		dateStart: Block["dateStart"],
		dateEnd: Block["dateEnd"],
		periodTitle: Block["periodTitle"]
	) {
		const { data, error } = await useFetch<Block>(URL_blockedDate, {
			method: "post",
			body: {
				dateStart,
				dateEnd,
				periodTitle,
				restaurantId: activeRestaurantId,
			},
		});
		if (data && data.value) blockedDatesList.value.push(data.value);
	}

	async function updateBlockedDate(
		blockId: Block["id"],
		dateStart: Block["dateStart"],
		dateEnd: Block["dateEnd"]
	) {
		await useFetch<Block>(`${URL_blockedDate}/${blockId}`, {
			method: "patch",
			body: { dateStart, dateEnd },
		});
		const blockedDateToUpdateIndex = blockedDatesList.value.findIndex(
			(e) => e.id === blockId
		);
		if (blockedDateToUpdateIndex !== -1) {
			blockedDatesList.value[blockedDateToUpdateIndex].dateStart = dateStart;
			blockedDatesList.value[blockedDateToUpdateIndex].dateEnd = dateEnd;
		}
	}

	// ACTIONS - Block All
	async function removeBlock(blockId: Block["id"]) {
		await useFetch(`${URL_block}/${blockId}`, { method: "delete" });

		// try to find the index in each state, remove the one that works

		// blockedDaysOfWeekList
		const blockedDayOfWeekToRemoveIndex = blockedDaysOfWeekList.value.findIndex(
			(e) => e.id === blockId
		);
		if (blockedDayOfWeekToRemoveIndex !== -1)
			blockedDaysOfWeekList.value.splice(blockedDayOfWeekToRemoveIndex, 1);

		// blockedTimesOnDayList
		const blockedTimeOnDayToRemoveIndex = blockedTimesOnDayList.value.findIndex(
			(e) => e.id === blockId
		);
		if (blockedTimeOnDayToRemoveIndex !== -1)
			blockedTimesOnDayList.value.splice(blockedTimeOnDayToRemoveIndex, 1);

		// blockedDatesList // TODO: this never gets it. I think it's the watch inside 'blocked-days'
		const blockedDateToRemoveIndex = blockedDatesList.value.findIndex(
			(e) => e.id === blockId
		);
		if (blockedDateToRemoveIndex !== -1)
			blockedDatesList.value.splice(blockedDateToRemoveIndex, 1);
	}

	return {
		// Block - 'dayOfWeek'
		blockedDaysOfWeekList,
		fetchBlockedDaysOfWeek,
		addOrUpdateBlockedDayOfWeek,
		// Block - 'Time Period On Date'
		blockedTimesOnDayList,
		fetchBlockedTimesOnDay,
		addBlockedTimeOnDay,
		updateBlockedTimeOnDay,
		// Block - 'One (or more) days period'
		blockedDatesList,
		blockedDatesListFullCalendar,
		fetchBlockedDates,
		addBlockedDate,
		updateBlockedDate,
		// Block - All
		removeBlock,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useBlocksStore, import.meta.hot));
}
