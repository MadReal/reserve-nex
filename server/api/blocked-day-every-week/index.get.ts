import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	try {
		const workHours = await prisma.workHour.findMany();
		return workHours;
	} catch (error) {
		console.error(error);
		return createError({ statusMessage: "An error occurred" });
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
