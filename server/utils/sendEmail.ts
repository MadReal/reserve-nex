import Joi from "joi";
import { Resend } from "resend";
import reservationAccepted from "~/email-templates/reservation-accepted";
import reservationCancelled from "~/email-templates/reservation-cancelled";

const resend = new Resend(process.env.RESEND_API_KEY);
const emailFrom = "PixelVision <info@pixelvisionagency.com>";

export const sendEmail = async (emailType: EmailType, emailBody: any) => {
  const emailSubject =
    emailType === "accepted"
      ? `Prenotazione Confermata - ${emailBody.restaurant.name}`
      : `La tua Prenotazione è stata annullato - ${emailBody.restaurant.name}`;
  const emailHtml =
    emailType === "accepted"
      ? reservationAccepted(emailBody)
      : reservationCancelled(emailBody);

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
