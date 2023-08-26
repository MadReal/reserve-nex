export const getPastDate = (daysBack = 1): Date => {
	const date = new Date();
	date.setDate(date.getDate() - daysBack);
	return date;
};
