import Joi, { string } from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const schema = Joi.object({
	timeFrom: Joi.string().required(),
	timeTo: Joi.string().required(),
	date: Joi.date().greater(new Date()).required(),
	restaurantId: Joi.number().required(),
});

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	// set date time to 00:00
	// body.date.setHours(0, 0, 0, 0);
	// validate body
	const { error, value } = schema.validate(body);
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
