export default function useSortWorkTimes(array: WorkTime[]): WorkTime[] {
	return array.sort((a, b) => {
		const [aHour, aMinute] = a.time.split(":").map(Number);
		const [bHour, bMinute] = b.time.split(":").map(Number);

		// Check if both times are in the range 00:00 - 04:00
		const isBothInMidnightRange = aHour >= 0 && aHour < 4 && bHour >= 0 && bHour < 4;

		if (isBothInMidnightRange) {
			// Both times are in the range 00:00 - 04:00, compare them normally.
			if (aHour === bHour) return aMinute - bMinute;
			return aHour - bHour;
		}

		// Only time 'a' is in the range 00:00 - 04:00, so it should come after 'b'.
		if (aHour >= 0 && aHour < 4) return 1;

		// Only time 'b' is in the range 00:00 - 04:00, so it should come after 'a'.
		if (bHour >= 0 && bHour < 4) return -1;

		// Neither time is in the range 00:00 - 04:00, compare them normally.
		if (aHour === bHour) return aMinute - bMinute;
		return aHour - bHour;
	});
}
