export default function useTranslateDayOfWeek(dayOfWeek: DayOfWeek): string {
	switch (dayOfWeek) {
		case 1:
			return "Lunedì";
		case 2:
			return "Martedì";
		case 3:
			return "Mercoledì";
		case 4:
			return "Giovedì";
		case 5:
			return "Venerdì";
		case 6:
			return "Sabato";
		case 7:
			return "Domenica";
		default:
			throw new Error("Invalid day of week");
	}
}
