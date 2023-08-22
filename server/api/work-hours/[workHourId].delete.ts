import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const { workHourId } = event.context.params as { workHourId: string };

	try {
		const workHourDelete = await prisma.workHour.delete({
			where: {
				id: parseInt(workHourId),
			},
		});
		return workHourDelete;
	} catch (error) {
		console.error(error);
		return createError({ statusMessage: "An error occurred" });
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
