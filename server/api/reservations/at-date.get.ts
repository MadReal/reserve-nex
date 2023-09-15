import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { restaurantId, date } = getQuery(event);
  const id: number | undefined =
    restaurantId !== null ? Number(restaurantId) : undefined;

  try {
    const where = { restaurantId: id, date: { equals: new Date(date as string) } };
    // * REQUEST *
    const reservations = await prisma.reservation.findMany({ where });
    return reservations;
  } catch (err) {
    console.error(err);
    throw new Error();
  } finally {
    await prisma.$disconnect(); // Disconnect the Prisma client after use
  }
});
