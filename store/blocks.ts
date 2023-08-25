const URL_block = "/api/block";
const URL_blockDayOfWeek = `${URL_block}/days-of-week`;
const URL_blockTimePeriod = `${URL_block}/time-period`;
const URL_blockDayPeriod = `${URL_block}/dates-period`;

export const useBlocksStore = defineStore("BlocksStore", () => {
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
	async function fetchBlockedDaysOfWeek() {
		const { data, error }: any = await useFetch(URL_blockDayOfWeek);
		if (data.value) {
			// Sort week days ascendent (Monday, Tuesday)
			const sortedBlocks = data.value.slice().sort((a: Block, b: Block) => {
				if (a.dayOfWeek === null && b.dayOfWeek === null) return 0;
				if (a.dayOfWeek === null) return 1;
				if (b.dayOfWeek === null) return -1;
				return a.dayOfWeek - b.dayOfWeek;
			});
			// Create the BlockDayOfWeek array
			const blockDayOfWeek = sortedBlocks.map((block: Block) => {
				return {
					id: block.id,
					restaurantId: block.restaurantId,
					dayOfWeek: block.dayOfWeek,
				};
			});
			blockedDaysOfWeekList.value = blockDayOfWeek;
		}
	}

	async function addOrUpdateBlockedDayOfWeek(
		oldDayOfWeekId: Block["id"],
		newDayOfWeek: Block["dayOfWeek"],
		isUpdate: boolean
	) {
		if (isUpdate) {
			await useFetch(`${URL_blockDayOfWeek}/${oldDayOfWeekId}`, {
				method: "patch",
				body: { dayOfWeek: newDayOfWeek, restaurantId: 1 },
			});
			const blockedDayOfWeekToUpdateIndex =
				blockedDaysOfWeekList.value.findIndex((e) => e.id === oldDayOfWeekId);
			blockedDaysOfWeekList.value[blockedDayOfWeekToUpdateIndex].dayOfWeek =
				newDayOfWeek;
		} else {
			const { data, error } = await useFetch(URL_blockDayOfWeek, {
				method: "post",
				body: { dayOfWeek: newDayOfWeek, restaurantId: 1 },
			});
			//@ts-ignore
			if (data.value) blockedDaysOfWeekList.value.push(data.value);
		}
	}

	// ACTIONS - Block - 'Time Period On Date'
	async function fetchBlockedTimesOnDay() {
		const { data, error }: any = await useFetch(URL_blockTimePeriod);
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
		todayMidnight.setHours(0, 0, 0, 0);

		const blockedTimeOnDay = {
			timeStart,
			timeEnd,
			date: todayMidnight,
			restaurantId: 1,
		};
		const { data, error } = await useFetch(URL_blockTimePeriod, {
			method: "post",
			body: blockedTimeOnDay,
		});
		//@ts-ignore
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
			restaurantId: 1,
		};

		await useFetch(`${URL_blockTimePeriod}/${blockId}`, {
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
	async function fetchBlockedDates() {
		const { data, error }: any = await useFetch(URL_blockDayPeriod);
		if (data.value) blockedDatesList.value = data.value;
	}

	async function addBlockedDate(
		dateStart: Block["dateStart"],
		dateEnd: Block["dateEnd"],
		periodTitle: Block["periodTitle"]
	) {
		try {
			const { data, error } = await useFetch(URL_blockDayPeriod, {
				method: "post",
				body: { dateStart, dateEnd, periodTitle, restaurantId: 1 },
			});
			//@ts-ignore
			if (data.value) blockedDatesList.value.push(data.value);
			return data.value as Block;
		} catch (error) {}
	}

	// ACTIONS - Block All
	async function removeBlock(blockId: Block["id"]) {
		await useFetch(`${URL_block}/${blockId}`, { method: "delete" });
		const blockToRemoveIndex = blockedDaysOfWeekList.value.findIndex(
			(e) => e.id === blockId
		);
		console.log(blockToRemoveIndex);

		blockedDaysOfWeekList.value.splice(blockToRemoveIndex, 1);
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
		// Block - All
		removeBlock,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useBlocksStore, import.meta.hot));
}
