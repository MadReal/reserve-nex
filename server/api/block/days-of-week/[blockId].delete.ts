import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const { blockId } = event.context.params as { blockId: string };

	try {
		const blockDayOfWeekDelete = await prisma.block.delete({
			where: {
				id: parseInt(blockId),
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
