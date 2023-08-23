import Joi from "joi";
import { PrismaClient, MealType } from "@prisma/client";

const prisma = new PrismaClient();

const schema = Joi.object({
	dayOfWeek: Joi.number().valid(1, 2, 3, 4, 5, 6, 7).required(),
	restaurantId: Joi.number().required(),
});

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	// validate body
	const { error, value } = schema.validate(body);
	if (error) throw createError({ statusMessage: error.message });

	const { dayOfWeek, restaurantId } = value;
	// add to Database
	const block = await prisma.block.create({
		data: { dayOfWeek, restaurantId },
	});

	// Disconnect the Prisma client after use
	await prisma.$disconnect();

	return block;
});
