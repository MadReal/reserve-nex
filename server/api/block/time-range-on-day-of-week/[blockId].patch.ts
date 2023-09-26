import Joi from "joi";
import { PrismaClient } from "@prisma/client";
import { schemaBlockedTimeRangeOnDayOfWeek } from "~/server/api/block/time-range-on-day-of-week/index.post";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	verifyAuthToken(event)

	const { blockId } = event.context.params as { blockId: string };
	const body = await readBody(event);
	// validate body
	const { error, value } = schemaBlockedTimeRangeOnDayOfWeek.validate(body);
	if (error) throw createError({ statusMessage: error.message });
	try {
		const { timeStart, timeEnd, dayOfWeek, restaurantId } = value;
		// * REQUEST *
		const blockUpdated = await prisma.block.update({
			where: { id: parseInt(blockId) },
			data: { timeStart, timeEnd, dayOfWeek, restaurantId },
		});
		return blockUpdated;
	} catch (err) {
		console.error(err);
		throw new Error();
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
