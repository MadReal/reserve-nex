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
	const body = await readBody(event);
	// Validate body
	const { error, value } = schema.validate(body);
	if (error) throw createError({ statusMessage: error.message });
	const { dayOfWeek, discountAmountId, workTimeId, restaurantId } = value;
	try {
		// console.log("workTimes");
		// console.log(workTimes);
		if (dayOfWeek === 10 && !workTimeId) {
			await prisma.discount.deleteMany({ where: { restaurantId } });
			const workTimes: WorkTime[] = await prisma.workTime.findMany({ where: { restaurantId } });
			workTimes.forEach(async (workTime) => {
				const discountData = [1, 2, 3, 4, 5, 6, 7].map((number) => ({
					discountAmountId,
					workTimeId: workTime.id,
					dayOfWeek: number,
					restaurantId,
				}));
				await prisma.discount.createMany({ data: discountData });
			})
		}
		else {
			console.log('specific hour');

			await prisma.discount.deleteMany({ where: { workTimeId, restaurantId } });
			const discountData = [1, 2, 3, 4, 5, 6, 7].map((number) => ({
				discountAmountId,
				workTimeId,
				dayOfWeek: number,
				restaurantId,
			}));
			// build them all
			await prisma.discount.createMany({ data: discountData });
		}
		const discounts = await prisma.discount.findMany({ where: { restaurantId }, include: includeDiscount });
		return discounts
	} catch (error) {
		console.error(
			`Error creating discounts`,
			error
		);
		throw error; // Rethrow the error to stop Promise.all if needed
	}

	// const results = await Promise.all(
	// 	workTimes.map(async (workTime: WorkTime) => {
	// 		try {
	// 			if (dayOfWeek === 10 && !workTimeId) {
	// 				// delete them all (if there are any)
	// 				await prisma.discount.deleteMany({ where: { restaurantId } });
	// 				// build them all
	// 				const discountData = [1, 2, 3, 4, 5, 6, 7].map((number) => ({
	// 					discountAmountId,
	// 					workTimeId: workTime.id,
	// 					dayOfWeek: number,
	// 					restaurantId,
	// 				}));

	// 				await prisma.discount.createMany({ data: discountData });
	// 				// fetch after createMany because we need 'include'
	// 				const discounts = await prisma.discount.findMany({
	// 					where: { restaurantId },
	// 					include: includeDiscount,
	// 				});
	// 				console.log("createMany");
	// 				console.log("discounts created");
	// 				console.log(discounts);

	// 				const filteredDiscounts = discounts.map(
	// 					({ workTimeId, discountAmountId, ...rest }) => rest
	// 				);
	// 				return filteredDiscounts;
	// 			} else {
	// 				// delete all the ones with same dayOfWeek
	// 				await prisma.discount.deleteMany({
	// 					where: { dayOfWeek, restaurantId },
	// 				});
	// 				// build them all
	// 				return await prisma.discount.create({
	// 					data: { workTimeId: workTime.id, ...value },
	// 					include: includeDiscount,
	// 				});
	// 			}
	// 		} catch (error) {
	// 			console.error(
	// 				`Error creating discounts for workTime.id ${workTime.id}:`,
	// 				error
	// 			);
	// 			throw error; // Rethrow the error to stop Promise.all if needed
	// 		}
	// 	}
	// 	)
	// );
	// Flatten the array of arrays into a single array of objects
	// const flattenedResults = results.flat();
	// return flattenedResults;

	finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
