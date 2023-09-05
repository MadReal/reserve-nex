import Joi from "joi";
import { PrismaClient } from "@prisma/client";
import { discountInclude } from "./index.get";

const prisma = new PrismaClient();

export const discountSchema = Joi.object({
	// amount: Joi.number().integer().min(1).max(99).precision(2).required(),
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
			include: discountInclude,
		});
		return discountAmount;
	} catch (err) {
		console.error(err);
		throw err;
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
