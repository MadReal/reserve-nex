export default function useTranslateDayOfWeek(dayOfWeek: DayOfWeek): string {
	const { locale } = useI18n();
	const isIT = locale.value === 'it';

	switch (dayOfWeek) {
		case 1:
			return isIT ? 'Lunedì' : 'Monday';
		case 2:
			return isIT ? 'Martedì' : 'Tuesday';
		case 3:
			return isIT ? 'Mercoledì' : 'Wednesday';
		case 4:
			return isIT ? 'Giovedì' : 'Thursday';
		case 5:
			return isIT ? 'Venerdì' : 'Friday';
		case 6:
			return isIT ? 'Sabato' : 'Saturday';
		case 7:
			return isIT ? 'Domenica' : 'Sunday';
		case 10:
			return isIT ? 'Tutti i Giorni' : 'Every Day';
		default:
			throw new Error('Invalid day of the week');
	}
}
