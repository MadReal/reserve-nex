import Joi from "joi";
import { PrismaClient, MealType } from "@prisma/client";

const prisma = new PrismaClient();

const schema = Joi.object({
	mealType: Joi.string().valid("LUNCH", "DINNER").required(),
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
		const { mealType, time, restaurantId } = value;
		// convert mealType to the enum
		let mealTypeValidated: MealType = mealType === "LUNCH" ? MealType.LUNCH : MealType.DINNER;

		// Check if a record with the same "time," "mealType," and "restaurantId" already exists
		const existingWorkTime = await prisma.workTime.findFirst({ where: { mealType, time, restaurantId } });
		if (existingWorkTime) return existingWorkTime
		else {
			// * REQUEST *
			const workTime = await prisma.workTime.create({ data: { mealType: mealTypeValidated, time, restaurantId }, });
			return workTime;
		}
	} catch (err) {
		console.error(err);
		throw new Error();
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
