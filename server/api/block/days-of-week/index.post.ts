import Joi from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const schemaBlockedDaysOfWeek = Joi.object({
	dayOfWeek: Joi.number().valid(1, 2, 3, 4, 5, 6, 7).required(),
	restaurantId: Joi.number().required(),
});

export default defineEventHandler(async (event) => {
	verifyAuthToken(event)

	const body = await readBody(event);
	// validate body
	const { error, value } = schemaBlockedDaysOfWeek.validate(body);
	if (error) throw createError({ statusMessage: error.message });
	try {
		const { dayOfWeek, restaurantId } = value;
		// * REQUEST *
		const block = await prisma.block.create({
			data: { dayOfWeek, restaurantId },
		});
		return block;
	} catch (err) {
		console.error(err);
		throw new Error();
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
