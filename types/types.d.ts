declare interface WorkTime {
	id: number;
	mealType: string;
	time: string;
	restaurantId: number;
}

type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

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

declare interface BlockDayOfWeek {
	id: number;
	dayOfWeek: DayOfWeek;
	timeFrom: null;
	timeTo: null;
	date: null;
	dateFrom: null;
	dateTo: null;
	restaurantId: number;
}
