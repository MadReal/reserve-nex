import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const { restaurantId } = getQuery(event);
	const id: number | undefined =
		restaurantId !== null ? Number(restaurantId) : undefined;

	try {
		// * REQUEST *
		const discounts = await prisma.discount.findMany({
			where: { restaurantId: id },
			include: {
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
			},
		});

		// Use type assertion to add the "value" property (needed later for Vue draggable)
		const modifiedDiscounts = discounts.map((item) => {
			const newItem = item as any; // Use "as any" to bypass TypeScript checks
			newItem.value = item.discountAmount.value;
			return newItem;
		});

		// Remove "workTimeId" and "discountAmountId" properties
		const filteredDiscounts = modifiedDiscounts.map(
			({ workTimeId, discountAmount, ...rest }) => rest
		);

		return filteredDiscounts;
	} catch (err) {
		console.error(err);
		throw err;
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});