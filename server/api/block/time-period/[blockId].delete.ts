import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const { blockId } = event.context.params as { blockId: string };

	try {
		// * REQUEST *
		const blockDayOfWeekToDelete = await prisma.block.delete({
			where: { id: parseInt(blockId) },
		});
		return blockDayOfWeekToDelete;
	} catch (err) {
		console.error(err);
		throw err;
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
