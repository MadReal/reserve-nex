export default function useSortWorkTimes(array: WorkTime[]): WorkTime[] {
	return array.sort((a, b) => {
		if (a.time === "00:00" || a.time === "00:30") return 1; // "00:00" and "00:30" should come last
		if (b.time === "00:00" || b.time === "00:30") return -1; // "00:00" and "00:30" should come last
		return parseInt(a.time) - parseInt(b.time);
	});
}
