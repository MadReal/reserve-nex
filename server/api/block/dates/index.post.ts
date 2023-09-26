import Joi from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const schema = Joi.object({
	dateStart: Joi.date().greater(getPastDate()).required(),
	dateEnd: Joi.date().greater(getPastDate()).required(),
	periodTitle: Joi.string().required(),
	restaurantId: Joi.number().required(),
});

export default defineEventHandler(async (event) => {
	verifyAuthToken(event)

	const body = await readBody(event);
	// Validate body
	const { error, value } = schema.validate(body);
	if (error) throw createError({ statusMessage: error.message });
	try {
		const { dateStart, dateEnd, periodTitle, restaurantId } = value;
		// * REQUEST *
		const blockCreated = await prisma.block.create({
			data: { dateStart, dateEnd, periodTitle, restaurantId },
		});
		return blockCreated;
	} catch (err) {
		console.error(err);
		throw new Error();
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
