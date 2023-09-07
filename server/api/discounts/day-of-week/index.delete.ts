import Joi from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const schema = Joi.object({
	dayOfWeek: Joi.number().required(),
	restaurantId: Joi.number().required(),
});

export default defineEventHandler(async (event) => {
	// const { dayOfWeek } = event.context.params as {
	// 	dayOfWeek: string;
	// };
	const body = await readBody(event);
	const { error, value } = schema.validate(body);
	if (error) throw createError({ statusMessage: error.message });

	const { dayOfWeek, restaurantId } = value;
	const where =
		dayOfWeek === 10 ? { restaurantId } : { restaurantId, dayOfWeek };
	try {
		// * REQUEST *
		return await prisma.discount.deleteMany({ where });
	} catch (err) {
		console.error(err);
		throw err;
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});