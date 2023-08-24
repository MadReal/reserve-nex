const blocksDayOfWeekApiUrl = "/api/block/days-of-week";

export const useBlocksStore = defineStore("BlocksStore", () => {
	const blocksDaysOfWeekList = ref<Block[]>([]);

	// ACTIONS
	async function fetchBlocksDayOfWeek() {
		try {
			const { data, error }: any = await useFetch(blocksDayOfWeekApiUrl);
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
		} catch (error) {
			console.error(error);
		}
	}

	async function addOrUpdateBlockDayOfWeek(
		oldDayOfWeekId: Block["id"],
		newDayOfWeek: Block["dayOfWeek"],
		isUpdate: boolean
	) {
		if (isUpdate) {
			await useFetch(`${blocksDayOfWeekApiUrl}/${oldDayOfWeekId}`, {
				method: "patch",
				body: { dayOfWeek: newDayOfWeek, restaurantId: 1 },
			});
			const dayOfWeekToUpdateIndex = blocksDaysOfWeekList.value.findIndex(
				(e) => e.id === oldDayOfWeekId
			);
			blocksDaysOfWeekList.value[dayOfWeekToUpdateIndex].dayOfWeek =
				newDayOfWeek;
		} else {
			const { data, error } = await useFetch(blocksDayOfWeekApiUrl, {
				method: "post",
				body: { dayOfWeek: newDayOfWeek, restaurantId: 1 },
			});
			if (data && data.value) blocksDaysOfWeekList.value.push(data.value);
		}
	}

	async function removeBlockDayOfWeek(blockId: Block["id"]) {
		await useFetch(`${blocksDayOfWeekApiUrl}/${blockId}`, { method: "delete" });
		const dayOfWeekToRemoveIndex = blocksDaysOfWeekList.value.findIndex(
			(e) => e.id === blockId
		);
		blocksDaysOfWeekList.value.splice(dayOfWeekToRemoveIndex, 1);
	}

	return {
		blocksDaysOfWeekList,
		fetchBlocksDayOfWeek,
		addOrUpdateBlockDayOfWeek,
		removeBlockDayOfWeek,
	};
});
