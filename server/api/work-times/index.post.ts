import Joi from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const schema = Joi.object({
	time: Joi.string().required(),
	restaurantId: Joi.number().required(),
});

export default defineEventHandler(async (event) => {
	verifyAuthToken(event)

	// validate body
	const body = await readBody(event);
	const { error, value } = schema.validate(body);
	if (error) throw createError({ statusMessage: error.message });
	try {
		const { time, restaurantId } = value;

		// Check if a record with the same "time" and "restaurantId" already exists
		const existingWorkTime = await prisma.workTime.findFirst({ where: { time, restaurantId } });
		if (existingWorkTime) return existingWorkTime
		else {
			// * REQUEST *
			const workTime = await prisma.workTime.create({ data: { time, restaurantId }, });
			return workTime;
		}
	} catch (err) {
		console.error(err);
		throw new Error();
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
