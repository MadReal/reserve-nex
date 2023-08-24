import Joi from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const date = new Date();
const yesterdayDate = date.setDate(date.getDate() - 1);

export const schemaBlockTimePeriod = Joi.object({
	timeFrom: Joi.string().required(),
	timeTo: Joi.string().required(),
	date: Joi.date().greater(yesterdayDate).required(),
	restaurantId: Joi.number().required(),
});

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	// Validate body
	const { error, value } = schemaBlockTimePeriod.validate(body);
	if (error) throw createError({ statusMessage: error.message });
	try {
		const { timeFrom, timeTo, date, restaurantId } = value;
		// * REQUEST *
		const blockCreated = await prisma.block.create({
			data: { timeFrom, timeTo, date, restaurantId },
		});
		return blockCreated;
	} catch (err) {
		console.error(err);
		throw err;
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
