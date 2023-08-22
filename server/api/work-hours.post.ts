import Joi from "joi";
import { PrismaClient, MealType } from "@prisma/client";

const prisma = new PrismaClient();

const schema = Joi.object({
	mealType: Joi.string().valid("lunch", "dinner").required(),
	timeSlot: Joi.string().required(),
});

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	// validate body
	const { error, value } = schema.validate(body);
	if (error) throw createError({ statusMessage: error.message });
	const { mealType, timeSlot } = value;
	// convert mealType to the enum
	let mealTypeValidated: MealType =
		mealType === "lunch" ? MealType.LUNCH : MealType.DINNER;
	// add to Database
	const workHour = await prisma.workHour.create({
		data: { mealType: mealTypeValidated, timeSlot },
	});

	// Disconnect the Prisma client after use
	await prisma.$disconnect();

	return workHour;
});
