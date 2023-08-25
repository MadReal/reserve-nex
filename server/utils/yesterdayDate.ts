export const getYesterdayDate = (): Date => {
	const date = new Date();
	date.setDate(date.getDate() - 1);
	return date;
};
