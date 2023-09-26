import Joi from "joi";
import { PrismaClient } from "@prisma/client";
import { includeDiscount } from "~/server/api/discounts/index.get";

const prisma = new PrismaClient();

export const schema = Joi.object({
	dayOfWeek: Joi.number().valid(1, 2, 3, 4, 5, 6, 7, 10).required(),
	discountAmountId: Joi.number().required(),
	workTimeId: Joi.number(),
	restaurantId: Joi.number().required(),
});

export default defineEventHandler(async (event) => {
	verifyAuthToken(event)

	const body = await readBody(event);
	const { error, value } = schema.validate(body); // Validate body
	if (error) throw createError({ statusMessage: error.message });

	const { dayOfWeek, discountAmountId, workTimeId, restaurantId } = value;

	try {
		// DiscountAmount dragged on ALL DAYS - ALL TIME
		if (dayOfWeek === 10 && !workTimeId) {
			// console.log('ALL DAYS - ALL TIME');
			await prisma.discount.deleteMany({ where: { restaurantId } });
			const workTimes: WorkTime[] = await prisma.workTime.findMany({ where: { restaurantId } });
			await Promise.all(workTimes.map(async (workTime) => {
				const data = [1, 2, 3, 4, 5, 6, 7].map((number) => ({ discountAmountId, workTimeId: workTime.id, dayOfWeek: number, restaurantId }));
				await prisma.discount.createMany({ data });
			}))
		}

		// DiscountAmount dragged on ALL DAYS - 1 TIME
		else if (dayOfWeek === 10 && workTimeId) {
			// console.log('ALL DAYS - 1 TIME');
			await prisma.discount.deleteMany({ where: { workTimeId, restaurantId } });
			const data = [1, 2, 3, 4, 5, 6, 7].map((number) => ({ discountAmountId, workTimeId, dayOfWeek: number, restaurantId }));
			await prisma.discount.createMany({ data });
		}

		// DiscountAmount dragged on 1 DAY - ALL TIME
		else if (dayOfWeek !== 10 && !workTimeId) {
			// console.log('1 DAY - ALL TIME');
			await prisma.discount.deleteMany({ where: { dayOfWeek, restaurantId } });
			const workTimes: WorkTime[] = await prisma.workTime.findMany({ where: { restaurantId } });
			await Promise.all(workTimes.map(async (workTime) => {
				const data = [1, 2, 3, 4, 5, 6, 7].map((number) => ({ discountAmountId, workTimeId: workTime.id, dayOfWeek, restaurantId }));
				await prisma.discount.createMany({ data });
			}))
		}

		const discounts = await prisma.discount.findMany({ where: { restaurantId }, include: includeDiscount });
		return discounts
	} catch (err) {
		console.error(`Error creating discounts`, err);
		throw new Error();
	}

	finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
