import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const { restaurantId } = getQuery(event);
	const id: number | undefined =
		restaurantId !== null ? Number(restaurantId) : undefined;
	try {
		// * REQUEST *
		const block = await prisma.block.findMany({
			where: {
				date: { gte: getPastDate() },
				timeStart: { not: null },
				timeEnd: { not: null },
				restaurantId: id,
			},
			select: {
				id: true,
				timeStart: true,
				timeEnd: true,
				date: true,
				restaurantId: true,
			},
		});
		return block;
	} catch (err) {
		console.error(err);
		throw err;
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
