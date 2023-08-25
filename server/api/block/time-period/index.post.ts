import Joi from "joi";
import { PrismaClient } from "@prisma/client";
import { yesterdayDate } from "@/utils/yesterdayDate";

const prisma = new PrismaClient();

export const schemaBlockTimePeriod = Joi.object({
	timeStart: Joi.string().required(),
	timeEnd: Joi.string().required(),
	date: Joi.date().greater(yesterdayDate).required(),
	restaurantId: Joi.number().required(),
});

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	// Validate body
	const { error, value } = schemaBlockTimePeriod.validate(body);
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
		throw err;
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
