import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const { workTimeId } = event.context.params as { workTimeId: string };
	try {
		// * REQUEST *
		const workTimeDelete = await prisma.workTime.delete({
			where: { id: parseInt(workTimeId) },
		});
		return workTimeDelete;
	} catch (err) {
		console.error(err);
		throw new Error();
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
