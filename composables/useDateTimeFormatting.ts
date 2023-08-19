export default function useDateTimeFormatting(isoTimestamp: string) {
	const dateObject = new Date(isoTimestamp);

	// Format the date and time
	const formattedDate = dateObject.toLocaleString("en-US", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});

	const formattedTime = dateObject.toLocaleString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false, // Use 24-hour format
	});

	return { formattedDate, formattedTime };
}
