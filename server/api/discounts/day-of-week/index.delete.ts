import Joi from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const schema = Joi.object({
	dayOfWeek: Joi.number().required(),
	restaurantId: Joi.number().required(),
});

export default defineEventHandler(async (event) => {
	// dayOfWeek & restaurantId inside the query params
	const queryParams = getQuery(event);

	const { error, value } = schema.validate(queryParams);
	if (error) throw createError({ statusMessage: error.message });

	const { dayOfWeek, restaurantId } = value;
	const where =
		dayOfWeek === 10 ? { restaurantId } : { restaurantId, dayOfWeek };
	try {
		// * REQUEST *
		return await prisma.discount.deleteMany({ where });
	} catch (err) {
		console.error(err);
		throw new Error();
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
