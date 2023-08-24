const URL_block = "/api/block";
const URL_blockDayOfWeek = `${URL_block}/days-of-week`;
const URL_blockTimePeriod = `${URL_block}/time-period`;

export const useBlocksStore = defineStore("BlocksStore", () => {
	// STATE - Block 'dayOfWeek'
	const blocksDaysOfWeekList = ref<Block[]>([]);
	// STATE - Block - 'Time Period On Date'
	const blocksTimePeriodList = ref<Block[]>([]);

	// ACTIONS - Block 'dayOfWeek'
	async function fetchBlocksDayOfWeek() {
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

	// ACTIONS - Block - 'Time Period On Date'
	async function fetchBlocksTimePeriod() {
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
			blocksTimePeriodList.value = sortedBlocks;
		}
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

	// ACTIONS - Block All
	async function removeBlock(blockId: Block["id"]) {
		await useFetch(`${URL_block}/${blockId}`, { method: "delete" });
		const blockToRemoveIndex = blocksDaysOfWeekList.value.findIndex(
			(e) => e.id === blockId
		);
		blocksDaysOfWeekList.value.splice(blockToRemoveIndex, 1);
	}

	return {
		// Block - 'dayOfWeek'
		blocksDaysOfWeekList,
		fetchBlocksDayOfWeek,
		addOrUpdateBlockDayOfWeek,
		// Block - 'Time Period On Date'
		blocksTimePeriodList,
		fetchBlocksTimePeriod,
		addBlockTimePeriod,
		updateBlockTimePeriod,
		// Block - All
		removeBlock,
	};
});
