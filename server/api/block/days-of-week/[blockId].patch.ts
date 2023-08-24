import Joi from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const schema = Joi.object({
	dayOfWeek: Joi.number().valid(1, 2, 3, 4, 5, 6, 7).required(),
	restaurantId: Joi.number().required(),
});

export default defineEventHandler(async (event) => {
	const { blockId } = event.context.params as { blockId: string };
	const body = await readBody(event);
	// validate body
	const { error, value } = schema.validate(body);
	if (error) throw createError({ statusMessage: error.message });
	try {
		const { dayOfWeek, restaurantId } = value;
		// * REQUEST *
		const blockDayOfWeekToUpdate = await prisma.block.update({
			where: { id: parseInt(blockId) },
			data: { dayOfWeek, restaurantId },
		});
		return blockDayOfWeekToUpdate;
	} catch (err) {
		console.error(err);
		throw err;
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
