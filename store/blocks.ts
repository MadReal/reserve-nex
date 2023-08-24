const URL_blocksDayOfWeek = "/api/block/days-of-week";
const URL_blocksWorkTimeOnDateList = "/api/block/work-time-on-date";

export const useBlocksStore = defineStore("BlocksStore", () => {
	// STATE - Block 'daysOfWeek'
	const blocksDaysOfWeekList = ref<Block[]>([]);
	// STATE - Block 'Work Hour On Date'
	const blocksWorkTimeOnDateList = ref<Block[]>([]);

	// ACTIONS - Block 'daysOfWeek'
	async function fetchBlocksDayOfWeek() {
		const { data, error }: any = await useFetch(URL_blocksDayOfWeek);
		if (data.value) {
			// Sort by dayOfWeek
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
			blocksDaysOfWeekList.value = blockDayOfWeek;
		}
	}

	async function addOrUpdateBlockDayOfWeek(
		oldDayOfWeekId: Block["id"],
		newDayOfWeek: Block["dayOfWeek"],
		isUpdate: boolean
	) {
		if (isUpdate) {
			await useFetch(`${URL_blocksDayOfWeek}/${oldDayOfWeekId}`, {
				method: "patch",
				body: { dayOfWeek: newDayOfWeek, restaurantId: 1 },
			});
			const dayOfWeekToUpdateIndex = blocksDaysOfWeekList.value.findIndex(
				(e) => e.id === oldDayOfWeekId
			);
			blocksDaysOfWeekList.value[dayOfWeekToUpdateIndex].dayOfWeek =
				newDayOfWeek;
		} else {
			const { data, error } = await useFetch(URL_blocksDayOfWeek, {
				method: "post",
				body: { dayOfWeek: newDayOfWeek, restaurantId: 1 },
			});
			//@ts-ignore
			if (data.value) blocksDaysOfWeekList.value.push(data.value);
		}
	}

	async function removeBlockDayOfWeek(blockId: Block["id"]) {
		await useFetch(`${URL_blocksDayOfWeek}/${blockId}`, { method: "delete" });
		const dayOfWeekToRemoveIndex = blocksDaysOfWeekList.value.findIndex(
			(e) => e.id === blockId
		);
		blocksDaysOfWeekList.value.splice(dayOfWeekToRemoveIndex, 1);
	}

	// ACTIONS - Block 'Work Hour On Date'
	async function fetchBlocksWorkTimeOnDateList() {
		const { data, error }: any = await useFetch(URL_blocksWorkTimeOnDateList);
		console.log(data.value);

		if (data.value) blocksWorkTimeOnDateList.value = data.value;
	}

	async function updateBlockWorkTimeOnDateList(
		blockId: Block["id"],
		timeFrom: Block["timeFrom"],
		timeTo: Block["timeTo"],
		date: Block["date"]
	) {
		const blockWorkTimeOnDate = {
			timeFrom,
			timeTo,
			date,
			restaurantId: 1,
		};

		await useFetch(`${URL_blocksWorkTimeOnDateList}/${blockId}`, {
			method: "patch",
			body: blockWorkTimeOnDate,
		});
		const blockWorkTimeOnDateToUpdateIndex =
			blocksWorkTimeOnDateList.value.findIndex((e) => e.id === blockId);
		const updatedBlockDayOfWeekToUpdateIndex = {
			...blocksWorkTimeOnDateList.value[blockWorkTimeOnDateToUpdateIndex],
			timeFrom,
			timeTo,
			date,
		};
		blocksWorkTimeOnDateList.value[blockWorkTimeOnDateToUpdateIndex] =
			updatedBlockDayOfWeekToUpdateIndex;
	}

	return {
		// Block - 'daysOfWeek'
		blocksDaysOfWeekList,
		fetchBlocksDayOfWeek,
		addOrUpdateBlockDayOfWeek,
		removeBlockDayOfWeek,
		// Block - 'Work Hour On Date'
		blocksWorkTimeOnDateList,
		fetchBlocksWorkTimeOnDateList,
		updateBlockWorkTimeOnDateList,
	};
});
