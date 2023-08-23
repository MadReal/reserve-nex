export default async function useFetchWorkHours() {
	const { data, error } = await useFetch("/api/work-times");

	if (error.value) {
		throw createError({
			...error.value,
			statusMessage: "error",
		});
	}

	return data.value ?? [];
}
