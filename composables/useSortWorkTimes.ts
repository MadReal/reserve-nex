export default function useSortWorkTimes(array: WorkTime[]): WorkTime[] {
	return array.sort((a, b) => {
		const [aHour, aMinute] = a.time.split(":").map(Number);
		const [bHour, bMinute] = b.time.split(":").map(Number);

		if (aHour === 0 && (aMinute === 0 || aMinute === 30)) return 1;
		if (bHour === 0 && (bMinute === 0 || bMinute === 30)) return -1;

		if (aHour === bHour) return aMinute - bMinute;
		else return aHour - bHour;
	});
}
