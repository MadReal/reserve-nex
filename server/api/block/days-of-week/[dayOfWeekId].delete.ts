import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const { workTimeId } = event.context.params as { workTimeId: string };

	try {
		const blockDayOfWeekDelete = await prisma.block.delete({
			where: {
				id: parseInt(workTimeId),
			},
		});
		return blockDayOfWeekDelete;
	} catch (err) {
		console.error(err);
		throw err;
		// return createError({ statusMessage: "An error occurred" });
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
