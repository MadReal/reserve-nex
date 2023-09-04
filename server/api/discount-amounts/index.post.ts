import Joi from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const schema = Joi.object({
	value: Joi.number().integer().min(1).max(99).precision(2).required(),
	restaurantId: Joi.number().required(),
});

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	// Validate body
	const { error, value } = schema.validate(body);
	if (error) throw createError({ statusMessage: error.message });
	try {
		// * REQUEST *
		const discountAmount = await prisma.discountAmount.create({ data: value });
		return discountAmount;
	} catch (err) {
		console.error(err);
		throw err;
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
