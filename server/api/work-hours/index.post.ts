import Joi from "joi";
import { PrismaClient, MealType } from "@prisma/client";

const prisma = new PrismaClient();

const schema = Joi.object({
	mealType: Joi.string().valid("LUNCH", "DINNER").required(),
	time: Joi.string().required(),
});

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	// validate body
	const { error, value } = schema.validate(body);
	if (error) throw createError({ statusMessage: error.message });
	const { mealType, time } = value;
	// convert mealType to the enum
	let mealTypeValidated: MealType =
		mealType === "LUNCH" ? MealType.LUNCH : MealType.DINNER;
	// add to Database
	const workTime = await prisma.workTime.create({
		data: { mealType: mealTypeValidated, time },
	});

	// Disconnect the Prisma client after use
	await prisma.$disconnect();

	return workTime;
});
