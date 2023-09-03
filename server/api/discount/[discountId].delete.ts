import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const { discountAmountId } = event.context.params as {
		discountAmountId: string;
	};

	try {
		// * REQUEST *
		const restaurant = await prisma.discountAmount.delete({
			where: { id: parseInt(discountAmountId) },
		});
		return restaurant;
	} catch (err) {
		console.error(err);
		throw err;
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
