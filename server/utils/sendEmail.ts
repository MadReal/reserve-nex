import { Resend } from "resend";
import reservationAcceptedIT from "~/email-templates/reservation-accepted-it";
import reservationAcceptedEN from "~/email-templates/reservation-accepted-en";
import reservationCancelledIT from "~/email-templates/reservation-cancelled-it";
import reservationCancelledEN from "~/email-templates/reservation-cancelled-en";

const resend = new Resend(process.env.RESEND_API_KEY);
const emailFrom = "PixelVision <info@pixelvisionagency.com>";

export const sendEmail = async (emailType: EmailType, emailBody: any) => {
  const emailSubjects = {
    accepted: {
      it: `Prenotazione Confermata - ${emailBody.restaurant.name}`,
      en: `Reservation Confirmed - ${emailBody.restaurant.name}`,
    },
    cancelled: {
      it: `La tua Prenotazione è stata annullata - ${emailBody.restaurant.name}`,
      en: `Your Reservation has been Cancelled - ${emailBody.restaurant.name}`,
    },
  };

  // Determine language based on personPhone
  const isItalian =
    emailBody.personPhone.startsWith("+39") ||
    emailBody.personPhone.startsWith("+41");
  const language = isItalian ? "it" : "en";
  const emailSubject = emailSubjects[emailType][language];

  // adjust date to be displayed correctly = "12/09/2023"
  if (emailBody.date) {
    // Create a Date object for the original date and time
    const originalDate = new Date(emailBody.date);
    // Extract the day, month, and year components
    const day = originalDate.getDate();
    const month = originalDate.getMonth() + 1; // Months are 0-based, so add 1
    const year = originalDate.getFullYear();
    // Format the components as "dd/mm/yyyy"
    const reservationDateFormatted = `${day}/${month}/${year}`;
    emailBody.date = reservationDateFormatted;
  }

  function selectEmailHtml() {
    return emailType === "accepted"
      ? language === "it"
        ? reservationAcceptedIT(emailBody)
        : reservationAcceptedEN(emailBody)
      : language === "it"
      ? reservationCancelledIT(emailBody)
      : reservationCancelledEN(emailBody);
  }

  const emailHtml = selectEmailHtml();

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
