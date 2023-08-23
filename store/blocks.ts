// store/filters.ts
import { defineStore } from "pinia";

export const useBlocksStore = defineStore("BlocksStore", () => {
	const blocksDayOfWeekList = ref<Block[]>([]);

	function addValueToBlocksList(value: Block) {
		blocksDayOfWeekList.value.push(value);
	}

	// functions get added to actions
	const fetchBlocksDayOfWeek = async () => {
		const { data, error }: any = await useFetch("/api/block/day-of-week");
		if (data.value) {
			data.value?.sort((a: number, b: number) => a - b);
			blocksDayOfWeekList.value = data.value;
		} else if (error) console.error(error);
	};

	return { blocksDayOfWeekList, addValueToBlocksList, fetchBlocksDayOfWeek };
});
