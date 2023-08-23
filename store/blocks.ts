const apiUrl = "/api/block/days-of-week";

export const useBlocksStore = defineStore("BlocksStore", () => {
	const blocksDaysOfWeekList = ref<BlockDayOfWeek[]>([]);

	// ACTIONS
	const fetchBlocksDayOfWeek = async () => {
		try {
			const { data, error }: any = await useFetch(apiUrl);
			if (data.value) {
				// red- order week days = lunedi, martedi, etc. etc.
				data.value?.sort((a: number, b: number) => a - b);

				const blockDayOfWeek = data.value.map((block: Block) => {
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
	};

	async function addOrUpdateBlockDayOfWeek(
		oldDayOfWeekId: BlockDayOfWeek["id"],
		newDayOfWeek: BlockDayOfWeek["dayOfWeek"],
		isUpdate: boolean
	) {
		console.log(isUpdate);

		if (isUpdate) removeBlockDayOfWeek(oldDayOfWeekId);
		else {
			try {
				const { data, error } = await useFetch(apiUrl, {
					method: "post",
					body: {
						dayOfWeek: newDayOfWeek,
						restaurantId: 1,
					},
				});
				if (data && data.value) blocksDaysOfWeekList.value.push(data.value);
			} catch (error) {
				console.error(error);
			}
		}
	}

	async function removeBlockDayOfWeek(dayOfWeekId: BlockDayOfWeek["id"]) {
		await useFetch(apiUrl + "/" + dayOfWeekId, { method: "delete" });
		const dayOfWeekToRemoveIndex = blocksDaysOfWeekList.value.findIndex(
			(e) => e.id === dayOfWeekId
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
