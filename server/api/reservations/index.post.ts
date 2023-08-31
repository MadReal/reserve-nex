import Joi from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const schema = Joi.object({
	time: Joi.string().required(),
	date: Joi.date().greater(getPastDate()).required(),
	personName: Joi.string().required(),
	personPhone: Joi.string().required(),
	personEmail: Joi.string().required(),
	peopleAmount: Joi.number().required(),
	personInstagram: Joi.string().required(),
	restaurantId: Joi.number().required(),
});

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	// Validate body
	const { error, value } = schema.validate(body);
	if (error) throw createError({ statusMessage: error.message });
	try {
		// * REQUEST *
		const reservation = await prisma.reservation.create({ data: value });
		return reservation;
	} catch (err) {
		console.error(err);
		throw err;
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
