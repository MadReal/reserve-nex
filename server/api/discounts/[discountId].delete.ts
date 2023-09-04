import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const { discountId } = event.context.params as {
		discountId: string;
	};

	try {
		// * REQUEST *
		const discount = await prisma.discount.delete({
			where: { id: parseInt(discountId) },
		});
		return discount;
	} catch (err) {
		console.error(err);
		throw err;
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
