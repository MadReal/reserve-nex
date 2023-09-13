import Joi from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const schema = Joi.object({
  time: Joi.string().required(),
  date: Joi.date().greater(getPastDate()).required(),
  discountAmount: Joi.number().allow(null),
  personName: Joi.string().required(),
  personPhone: Joi.string().required(),
  personEmail: Joi.string().email().required(),
  peopleAmount: Joi.number().required(),
  personInstagram: Joi.string().allow(null),
  restaurantId: Joi.number().required(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  // Validate body
  const { error, value } = schema.validate(body);
  if (error) throw createError({ statusMessage: error.message });
  try {
    // * REQUEST *
    const reservation = await prisma.reservation.create({
      data: { ...value, accepted: true },
    });
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: value.restaurantId },
      select: { name: true, address: true, city: true, zipCode: true },
    });

    // Create a Date object for the original date and time
    const originalDate = new Date(reservation.date);
    // Extract the day, month, and year components
    const day = originalDate.getDate();
    const month = originalDate.getMonth() + 1; // Months are 0-based, so add 1
    const year = originalDate.getFullYear();
    // Format the components as "dd/mm/yyyy"
    const reservationDateFormatted = `${day}/${month}/${year}`;

    const emailBody = {
      restaurant,
      reservationId: reservation.id,
      date: reservationDateFormatted,
      time: reservation.time,
      peopleAmount: reservation.peopleAmount,
      personEmail: reservation.personEmail,
      personName: reservation.personName,
    };
    await sendEmail("accepted", emailBody);

    return reservation;
  } catch (err) {
    console.error(err);
    throw new Error();
  } finally {
    await prisma.$disconnect(); // Disconnect the Prisma client after use
  }
});
