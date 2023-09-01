import Joi from "joi";
import { PrismaClient } from "@prisma/client";
import { restaurantSchema } from "./index.post";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const { restaurantId } = event.context.params as { restaurantId: string };
	const body = await readBody(event);
	// validate body
	const { error, value } = restaurantSchema.validate(body);
	if (error) throw createError({ statusMessage: error.message });
	try {
		const { name, address, city, zipCode } = value;
		// * REQUEST *
		const restaurantToUpdate = await prisma.restaurant.update({
			where: { id: parseInt(restaurantId) },
			data: { name, address, city, zipCode },
		});
		return restaurantToUpdate;
	} catch (err) {
		console.error(err);
		throw err;
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
