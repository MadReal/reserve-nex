import Joi from "joi";
import { PrismaClient } from "@prisma/client";
import { discountInclude } from "./index.get";

const prisma = new PrismaClient();

export const schema = Joi.object({
	discountAmountId: Joi.number(),
	workTimeId: Joi.number().required(),
});

export default defineEventHandler(async (event) => {
	const { discountId } = event.context.params as { discountId: string };
	const body = await readBody(event);
	// validate body
	const { error, value } = schema.validate(body);
	if (error) throw createError({ statusMessage: error.message });
	try {
		const { discountAmountId, workTimeId } = value;
		// * REQUEST *
		const discountToUpdate = await prisma.discount.update({
			where: { id: parseInt(discountId) },
			data: { discountAmountId, workTimeId },
			include: discountInclude,
		});
		return discountToUpdate;
	} catch (err) {
		console.error(err);
		throw err;
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
