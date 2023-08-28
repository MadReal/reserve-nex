import Joi from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const schema = Joi.object({
	name: Joi.string().required(),
});

export default defineEventHandler(async (event) => {
	const { restaurantId } = event.context.params as { restaurantId: string };
	const body = await readBody(event);
	// validate body
	const { error, value } = schema.validate(body);
	if (error) throw createError({ statusMessage: error.message });
	try {
		const { name } = value;
		// * REQUEST *
		const restaurantToUpdate = await prisma.restaurant.update({
			where: { id: parseInt(restaurantId) },
			data: { name },
		});
		return restaurantToUpdate;
	} catch (err) {
		console.error(err);
		throw err;
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
