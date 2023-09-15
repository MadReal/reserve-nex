import Joi from "joi";
import { PrismaClient } from "@prisma/client";
import { schemaBlockedTimeRangeOnDate } from "~/server/api/block/time-range-on-date/index.post";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const { blockId } = event.context.params as { blockId: string };
	const body = await readBody(event);
	// validate body
	const { error, value } = schemaBlockedTimeRangeOnDate.validate(body);
	if (error) throw createError({ statusMessage: error.message });
	try {
		const { timeStart, timeEnd, date, restaurantId } = value;
		// * REQUEST *
		const blockUpdated = await prisma.block.update({
			where: { id: parseInt(blockId) },
			data: { timeStart, timeEnd, date, restaurantId },
		});
		return blockUpdated;
	} catch (err) {
		console.error(err);
		throw new Error();
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
