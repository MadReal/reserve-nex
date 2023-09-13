import Joi from "joi";
import { Resend } from "resend";
import reservationAccepted from "~/email-templates/reservation-accepted";
import reservationRefused from "~/email-templates/reservation-refused";

const resend = new Resend(process.env.RESEND_API_KEY);
const emailFrom = "info@pixelvisionagency.com";

// const schema = Joi.object({
//     emailEmail: Joi.string().required(),
//     personName: Joi.string().required(),
//     date: Joi.string().required(),
//     time: Joi.string().required(),
//     reservationId: Joi.string().required(),
//     peopleAmount: Joi.number().required(),
//     restaurantName: Joi.string().required(),
//     restaurantAddress: Joi.string().required(),
// });

export const sendEmail = async (emailType: EmailType, emailBody: any) => {
  // Validate body
  // const { value, error } = schema.validate(body);
  // if (error) throw createError({ statusMessage: error.message });

  const emailSubject =
    emailType === "accepted"
      ? `Conferma Prenotazione ${emailBody.restaurant.name}`
      : `La tua Prenotazione è stata cancellata - ${emailBody.restaurant.name}`;
  const emailHtml =
    emailType === "accepted"
      ? reservationAccepted(emailBody)
      : reservationRefused(emailBody);

  try {
    const data = await resend.emails.send({
      from: emailFrom,
      to: emailBody.personEmail,
      subject: emailSubject,
      html: emailHtml,
    });
    return data;
  } catch (err) {
    console.error(err);
    throw new Error();
  }
};

// export const runtime = 'edge';
// export const dynamic = 'force-dynamic';

// const RESEND_API_KEY = new Resend(process.env.RESEND_API_KEY);

// export async function POST() {
//     const res = await fetch('https://api.resend.com/emails', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${RESEND_API_KEY}`,
//         },
//         body: JSON.stringify({
//             from: 'Acme <onboarding@resend.dev>',
//             to: ['delivered@resend.dev'],
//             subject: 'hello world',
//             html: '<strong>it works!</strong>',
//         }),
//     });

//     if (res.ok) {
//         const data = await res.json();
//         return NextResponse.json(data);
//     }
// }
