import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const { restaurantId } = getQuery(event);
	const id: number | undefined =
		restaurantId !== null ? Number(restaurantId) : undefined;

	try {
		// * REQUEST *
		const workTimes = await prisma.workTime.findMany({
			where: { restaurantId: id },
		});
		return workTimes;
	} catch (err) {
		console.error(err);
		throw new Error();
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
