import Joi from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const schema = Joi.object({
	// createdAt: Joi.number().required(),
	// time: Joi.string().required(),
	// date: Joi.date().greater(getYesterdayDate()).required(),
	// personName: Joi.string().required(),
	// personPhone: Joi.string().required(),
	// personEmail: Joi.string().required(),
	// peopleAmount: Joi.number().required(),
	accepted: Joi.boolean().required(),
	// restaurantId: Joi.number().required(),
});

export default defineEventHandler(async (event) => {
	const { reservationId } = event.context.params as { reservationId: string };
	const body = await readBody(event);
	// validate body
	const { error, value } = schema.validate(body);
	if (error) throw createError({ statusMessage: error.message });
	try {
		const { accepted, restaurantId } = value;
		// * REQUEST *
		const reservationToUpdate = await prisma.reservation.update({
			where: { id: reservationId },
			data: { accepted, restaurantId },
		});
		return reservationToUpdate;
	} catch (err) {
		console.error(err);
		throw err;
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
