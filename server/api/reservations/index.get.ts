import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const { restaurantId, searchQuery } = getQuery(event);
	const id: number | undefined =
		restaurantId !== null ? Number(restaurantId) : undefined;

	try {
		const where = {
			restaurantId: id,
			date: { gte: getPastDate() },
		};
		const whereSearch = {
			...where,
			OR: [
				{ id: { contains: searchQuery, mode: "insensitive" } },
				{ personName: { contains: searchQuery, mode: "insensitive" } },
				{ personEmail: { contains: searchQuery, mode: "insensitive" } },
			],
		};
		// * REQUEST *
		const reservations = await prisma.reservation.findMany({
			where: searchQuery ? whereSearch : where,
		});
		return reservations;
	} catch (err) {
		console.error(err);
		throw new Error();
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
