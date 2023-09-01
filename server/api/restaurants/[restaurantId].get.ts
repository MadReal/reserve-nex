import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const { restaurantId } = event.context.params as unknown as {
		restaurantId: Restaurant["id"];
	};

	try {
		// * REQUEST *
		const restaurant = await prisma.restaurant.findUnique({
			where: {
				id: restaurantId,
			},
		});
		return restaurant;
	} catch (err) {
		console.error(err);
		throw err;
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
