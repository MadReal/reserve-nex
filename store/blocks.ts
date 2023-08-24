const URL_blockDayOfWeek = "/api/block/days-of-week";
const URL_blockTimePeriod = "/api/block/time-period";

export const useBlocksStore = defineStore("BlocksStore", () => {
	// STATE - Block 'daysOfWeek'
	const blocksDaysOfWeekList = ref<Block[]>([]);
	// STATE - Block 'Work Hour On Date'
	const blocksTimePeriodList = ref<Block[]>([]);

	// ACTIONS - Block 'daysOfWeek'
	async function fetchBlocksDayOfWeek() {
		const { data, error }: any = await useFetch(URL_blockDayOfWeek);
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
			await useFetch(`${URL_blockDayOfWeek}/${oldDayOfWeekId}`, {
				method: "patch",
				body: { dayOfWeek: newDayOfWeek, restaurantId: 1 },
			});
			const dayOfWeekToUpdateIndex = blocksDaysOfWeekList.value.findIndex(
				(e) => e.id === oldDayOfWeekId
			);
			blocksDaysOfWeekList.value[dayOfWeekToUpdateIndex].dayOfWeek =
				newDayOfWeek;
		} else {
			const { data, error } = await useFetch(URL_blockDayOfWeek, {
				method: "post",
				body: { dayOfWeek: newDayOfWeek, restaurantId: 1 },
			});
			//@ts-ignore
			if (data.value) blocksDaysOfWeekList.value.push(data.value);
		}
	}

	async function removeBlockDayOfWeek(blockId: Block["id"]) {
		await useFetch(`${URL_blockDayOfWeek}/${blockId}`, { method: "delete" });
		const dayOfWeekToRemoveIndex = blocksDaysOfWeekList.value.findIndex(
			(e) => e.id === blockId
		);
		blocksDaysOfWeekList.value.splice(dayOfWeekToRemoveIndex, 1);
	}

	// ACTIONS - Block 'Work Hour On Date'
	async function fetchBlocksTimePeriod() {
		const { data, error }: any = await useFetch(URL_blockTimePeriod);
		if (data.value) blocksTimePeriodList.value = data.value;
	}

	async function addBlockTimePeriod(
		timeFrom: Block["timeFrom"],
		timeTo: Block["timeTo"]
	) {
		const todayMidnight = new Date();
		todayMidnight.setHours(0, 0, 0, 0);

		const blockTimePeriod = {
			timeFrom,
			timeTo,
			date: todayMidnight,
			restaurantId: 1,
		};
		const { data, error } = await useFetch(URL_blockTimePeriod, {
			method: "post",
			body: blockTimePeriod,
		});
		//@ts-ignore
		if (data.value) blocksTimePeriodList.value.push(data.value);
	}

	async function updateBlockTimePeriod(
		blockId: Block["id"],
		timeFrom: Block["timeFrom"],
		timeTo: Block["timeTo"],
		date: Block["date"]
	) {
		const blockTimePeriod = {
			timeFrom,
			timeTo,
			date,
			restaurantId: 1,
		};

		await useFetch(`${URL_blockTimePeriod}/${blockId}`, {
			method: "patch",
			body: blockTimePeriod,
		});
		const blockTimePeriodToUpdateIndex = blocksTimePeriodList.value.findIndex(
			(e) => e.id === blockId
		);
		const newBlockTimePeriod = {
			...blocksTimePeriodList.value[blockTimePeriodToUpdateIndex],
			timeFrom,
			timeTo,
			date,
		};
		blocksTimePeriodList.value[blockTimePeriodToUpdateIndex] =
			newBlockTimePeriod;
	}

	return {
		// Block - 'daysOfWeek'
		blocksDaysOfWeekList,
		fetchBlocksDayOfWeek,
		addOrUpdateBlockDayOfWeek,
		removeBlockDayOfWeek,
		// Block - 'Work Hour On Date'
		blocksTimePeriodList,
		fetchBlocksTimePeriod,
		addBlockTimePeriod,
		updateBlockTimePeriod,
	};
});
