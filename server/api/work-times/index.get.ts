import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	try {
		const workTimes = await prisma.workTime.findMany();
		return workTimes;
	} catch (err) {
		console.error(err);
		throw err;
		// return createError({ statusMessage: "An error occurred" });
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});