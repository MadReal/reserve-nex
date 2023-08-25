import Joi from "joi";
import { PrismaClient } from "@prisma/client";
import { schemaBlockedDaysOfWeek } from "~/server/api/block/days-of-week/index.post";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const { blockId } = event.context.params as { blockId: string };
	const body = await readBody(event);
	// validate body
	const { error, value } = schemaBlockedDaysOfWeek.validate(body);
	if (error) throw createError({ statusMessage: error.message });
	try {
		const { dayOfWeek, restaurantId } = value;
		// * REQUEST *
		const blockDaysOfWeekToUpdate = await prisma.block.update({
			where: { id: parseInt(blockId) },
			data: { dayOfWeek, restaurantId },
		});
		return blockDaysOfWeekToUpdate;
	} catch (err) {
		console.error(err);
		throw err;
	} finally {
		await prisma.$disconnect(); // Disconnect the Prisma client after use
	}
});
