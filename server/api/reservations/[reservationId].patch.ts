import Joi from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const schema = Joi.object({
	accepted: Joi.boolean().required(),
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
		throw new Error();
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
