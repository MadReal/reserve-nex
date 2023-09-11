import Joi from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const schemaBlockedTimesOnDay = Joi.object({
	timeStart: Joi.string().required(),
	timeEnd: Joi.string().required(),
	date: Joi.date().greater(getPastDate()).required(),
	restaurantId: Joi.number().required(),
});

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	// Validate body
	const { error, value } = schemaBlockedTimesOnDay.validate(body);
	if (error) throw createError({ statusMessage: error.message });
	try {
		const { timeStart, timeEnd, date, restaurantId } = value;
		// * REQUEST *
		const blockCreated = await prisma.block.create({
			data: { timeStart, timeEnd, date, restaurantId },
		});
		return blockCreated;
	} catch (err) {
		console.error(err);
		throw new Error();
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
