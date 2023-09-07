import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const includeDiscount = {
	workTime: {
		select: {
			id: true,
			time: true,
		},
	},
	discountAmount: {
		select: {
			id: true,
			value: true,
		},
	},
};

export default defineEventHandler(async (event) => {
	const { dayOfWeek, restaurantId } = getQuery(event);
	const id: number | undefined =
		restaurantId !== null ? Number(restaurantId) : undefined;

	const where = dayOfWeek
		? { restaurantId: id, dayOfWeek: Number(dayOfWeek) }
		: { restaurantId: id };

	try {
		// * REQUEST *
		const discounts = await prisma.discount.findMany({
			where,
			include: includeDiscount,
		});

		// Remove "workTimeId" and "discountAmountId" properties
		const filteredDiscounts = discounts.map(
			({ workTimeId, discountAmountId, ...rest }) => rest
		);

		return filteredDiscounts;
	} catch (err) {
		console.error(err);
		throw err;
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
