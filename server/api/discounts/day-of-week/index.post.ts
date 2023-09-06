import Joi from "joi";
import { PrismaClient } from "@prisma/client";
import { discountInclude } from "~/server/api/discounts/index.get";

const prisma = new PrismaClient();

export const schema = Joi.object({
	dayOfWeek: Joi.number().valid(1, 2, 3, 4, 5, 6, 7, 10).required(),
	discountAmountId: Joi.number().required(),
	restaurantId: Joi.number().required(),
});

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	// Validate body
	const { error, value } = schema.validate(body);
	if (error) throw createError({ statusMessage: error.message });
	const { dayOfWeek, discountAmountId, restaurantId } = value;
	try {
		const workTimesList: WorkTime[] = await prisma.workTime.findMany({
			where: { restaurantId },
		});
		const results = await Promise.all(
			workTimesList.map(async (workTime) => {
				if (dayOfWeek === 10) {
					// delete them all (if there are any)
					await prisma.discount.deleteMany({ where: { restaurantId } });
					// build them all
					return await prisma.discount.createMany({
						data: [
							{ ...value, workTimeId: workTime.id, dayOfWeek: 1 },
							{ ...value, workTimeId: workTime.id, dayOfWeek: 2 },
							{ ...value, workTimeId: workTime.id, dayOfWeek: 3 },
							{ ...value, workTimeId: workTime.id, dayOfWeek: 4 },
							{ ...value, workTimeId: workTime.id, dayOfWeek: 5 },
							{ ...value, workTimeId: workTime.id, dayOfWeek: 6 },
							{ ...value, workTimeId: workTime.id, dayOfWeek: 7 },
						],
					});
				} else {
					// delete all the ones with same dayOfWeek
					await prisma.discount.deleteMany({
						where: { dayOfWeek: dayOfWeek, restaurantId },
					});
					// build them all
					return await prisma.discount.create({
						data: { workTimeId: workTime.id, ...value },
					});
				}
			})
		);
		return results;
	} catch (err) {
		console.error(err);
		throw err;
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
