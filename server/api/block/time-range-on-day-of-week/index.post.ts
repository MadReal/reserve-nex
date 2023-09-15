import Joi from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const schemaBlockedTimeRangeOnDayOfWeek = Joi.object({
	timeStart: Joi.string().required(),
	timeEnd: Joi.string().required(),
	dayOfWeek: Joi.number().valid(1, 2, 3, 4, 5, 6, 7).required(),
	restaurantId: Joi.number().required(),
});

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	// Validate body
	const { error, value } = schemaBlockedTimeRangeOnDayOfWeek.validate(body);
	if (error) throw createError({ statusMessage: error.message });
	try {
		const { timeStart, timeEnd, dayOfWeek, restaurantId } = value;
		// * REQUEST *
		const blockCreated = await prisma.block.create({
			data: { timeStart, timeEnd, dayOfWeek, restaurantId },
		});
		return blockCreated;
	} catch (err) {
		console.error(err);
		throw new Error();
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
