import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	try {
		const block = await prisma.block.findMany({
			where: {
				dayOfWeek: { not: null },
			},
		});
		return block;
	} catch (err) {
		console.error(err);
		return createError({ statusMessage: "An error occurred" });
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
