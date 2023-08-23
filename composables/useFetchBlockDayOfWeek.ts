export default async function useFetchBlockDayOfWeek() {
	const { data, error } = await useFetch("/api/block/day-of-week");

	if (error.value) {
		throw createError({
			...error.value,
			statusMessage: "error",
		});
	}

	const sortedDayOfWeeks = data.value?.sort((a: number, b: number) => a - b);
	return sortedDayOfWeeks ?? [];
}
