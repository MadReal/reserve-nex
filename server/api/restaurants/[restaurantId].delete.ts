import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const { restaurantId } = event.context.params as { restaurantId: string };

	try {
		// * REQUEST *
		const restaurant = await prisma.restaurant.delete({
			where: { id: parseInt(restaurantId) },
		});
		return restaurant;
	} catch (err) {
		console.error(err);
		throw new Error();
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
