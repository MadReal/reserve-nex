export function useSortWorkHours(array: WorkHour[]): WorkHour[] {
	return array.sort((a, b) => {
		if (a.timeSlot === "00:00" || a.timeSlot === "00:30") return 1; // "00:00" and "00:30" should come last
		if (b.timeSlot === "00:00" || b.timeSlot === "00:30") return -1; // "00:00" and "00:30" should come last
		return parseInt(a.timeSlot) - parseInt(b.timeSlot);
	});
}
