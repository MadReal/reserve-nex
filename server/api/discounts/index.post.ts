import Joi from "joi";
import { PrismaClient } from "@prisma/client";
import { includeDiscount } from "~/server/api/discounts/index.get";

const prisma = new PrismaClient();

export const discountSchema = Joi.object({
	dayOfWeek: Joi.number().valid(1, 2, 3, 4, 5, 6, 7).required(),
	discountAmountId: Joi.number().required(),
	workTimeId: Joi.number().required(),
	restaurantId: Joi.number().required(),
});

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	// Validate body
	const { error, value } = discountSchema.validate(body);
	if (error) throw createError({ statusMessage: error.message });
	try {
		const { dayOfWeek, discountAmountId, workTimeId, restaurantId } = value;
		// * REQUEST *
		const discountAmount = await prisma.discount.create({
			data: { dayOfWeek, discountAmountId, workTimeId, restaurantId },
			include: includeDiscount,
		});
		return discountAmount;
	} catch (err) {
		console.error(err);
		throw new Error();
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
