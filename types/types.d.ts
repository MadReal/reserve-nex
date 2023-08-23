declare interface WorkTime {
	id: number;
	mealType: string;
	time: string;
	restaurantId: number;
}

type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

declare interface Block {
	id: number;
	dayOfWeek: DayOfWeek;
	timeFrom: string;
	timeTo: string;
	date: Date;
	dateFrom: Date;
	dateTo: Date;
	restaurantId: number;
}
