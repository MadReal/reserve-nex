import Joi from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const restaurantSchema = Joi.object({
	name: Joi.string().required(),
	address: Joi.string().required(),
	city: Joi.string().required(),
	zipCode: Joi.number().required(),
	isLive: Joi.boolean().required(),
});

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	// Validate body
	const { error, value } = restaurantSchema.validate(body);
	if (error) throw createError({ statusMessage: error.message });
	try {
		// * REQUEST *
		const restaurant = await prisma.restaurant.create({ data: value });
		return restaurant;
	} catch (err) {
		console.error(err);
		throw new Error();
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
