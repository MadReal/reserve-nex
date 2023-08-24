import Joi from "joi";
import { PrismaClient } from "@prisma/client";
import { schemaBlockTimePeriod } from "~/server/api/block/time-period/index.post";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const { blockId } = event.context.params as { blockId: string };
	const body = await readBody(event);
	// validate body
	const { error, value } = schemaBlockTimePeriod.validate(body);
	if (error) throw createError({ statusMessage: error.message });
	try {
		const { timeFrom, timeTo, date, restaurantId } = value;
		// * REQUEST *
		const blockUpdated = await prisma.block.update({
			where: { id: parseInt(blockId) },
			data: { timeFrom, timeTo, date, restaurantId },
		});
		return blockUpdated;
	} catch (err) {
		console.error(err);
		throw err;
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
