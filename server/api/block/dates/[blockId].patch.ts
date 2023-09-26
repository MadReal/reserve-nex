import Joi from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const schema = Joi.object({
	dateStart: Joi.date().greater(getPastDate()).required(),
	dateEnd: Joi.date().greater(getPastDate()).required(),
});

export default defineEventHandler(async (event) => {
	verifyAuthToken(event)

	const { blockId } = event.context.params as { blockId: string };
	const body = await readBody(event);
	// validate body
	const { error, value } = schema.validate(body);
	if (error) throw createError({ statusMessage: error.message });
	try {
		const { dateStart, dateEnd } = value;
		// * REQUEST *
		const blockUpdated = await prisma.block.update({
			where: { id: parseInt(blockId) },
			data: { dateStart, dateEnd },
		});
		return blockUpdated;
	} catch (err) {
		console.error(err);
		throw new Error();
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
