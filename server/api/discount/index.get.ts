import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const { restaurantId } = getQuery(event);
	const id: number | undefined =
		restaurantId !== null ? Number(restaurantId) : undefined;

	try {
		// * REQUEST *
		const discount = await prisma.discount.findMany({
			where: { restaurantId: id },
			include: {
				workTime: {
					select: {
						id: true,
						time: true,
					},
				},
				amount: {
					select: {
						id: true,
						amount: true,
					},
				},
			},
		});

		return discount;
	} catch (err) {
		console.error(err);
		throw err;
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
