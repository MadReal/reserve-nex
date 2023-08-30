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
	timeStart: string | null;
	timeEnd: string | null;
	date: Date | null;
	dateStart: Date | null;
	dateEnd: Date | null;
	periodTitle: string | null;
	restaurantId: number;
}

declare interface Reservation {
	id: number;
	createdAt: Date;
	time: string;
	date: Date;
	personName: string;
	personPhone: string;
	personEmail: string;
	peopleAmount: number;
	accepted: boolean | null;
	restaurantId: number;
}

declare interface Restaurant {
	id: number;
	name: string;
}

type ModalType = "restaurant" | "reservation";
