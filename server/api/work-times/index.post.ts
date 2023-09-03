import Joi from "joi";
import { PrismaClient, MealType } from "@prisma/client";

const prisma = new PrismaClient();

const schema = Joi.object({
	mealType: Joi.string().valid("LUNCH", "DINNER").required(),
	time: Joi.string().required(),
	restaurantId: Joi.number().required(),
});

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	// validate body
	const { error, value } = schema.validate(body);
	if (error) throw createError({ statusMessage: error.message });
	try {
		const { mealType, time, restaurantId } = value;
		// convert mealType to the enum
		let mealTypeValidated: MealType =
			mealType === "LUNCH" ? MealType.LUNCH : MealType.DINNER;
		// * REQUEST *
		const workTime = await prisma.workTime.create({
			data: { mealType: mealTypeValidated, time, restaurantId },
		});
		return workTime;
	} catch (err) {
		console.error(err);
		throw err;
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
