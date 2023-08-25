import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	try {
		// Get yesterday's date
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		// * REQUEST *
		const reservations = await prisma.reservation.findMany({
			where: { date: { gte: getYesterdayDate() } },
		});
		return reservations;
	} catch (err) {
		console.error(err);
		throw err;
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
