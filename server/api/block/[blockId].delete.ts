import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	verifyAuthToken(event)

	const { blockId } = event.context.params as { blockId: string };

	try {
		// * REQUEST *
		const block = await prisma.block.delete({
			where: { id: parseInt(blockId) },
		});
		return block;
	} catch (err) {
		console.error(err);
		throw new Error();
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
