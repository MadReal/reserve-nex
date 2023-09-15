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
				dayOfWeek: { not: null },
				timeStart: null,
				timeEnd: null,
				restaurantId: id
			},
			select: {
				id: true,
				dayOfWeek: true,
				restaurantId: true,
			},
		});
		return block;
	} catch (err) {
		console.error(err);
		throw new Error();
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
