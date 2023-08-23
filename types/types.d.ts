declare interface WorkTime {
	id: number;
	mealType: string;
	time: string;
	restaurantId: number;
}

enum DayOfWeek {
	MONDAY = 1,
	TUESDAY = 2,
	WEDNESDAY = 3,
	THURSDAY = 4,
	FRIDAY = 5,
	SATURDAY = 6,
	SUNDAY = 7,
}

declare interface Block {
	id: number;
	dayOfWeek: DayOfWeek | null;
	timeFrom: string | null;
	timeTo: string | null;
	date: Date | null;
	dateFrom: Date | null;
	dateTo: Date | null;
	restaurantId: number | null;
}
