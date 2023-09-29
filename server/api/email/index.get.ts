import reservationAcceptedIT from "~/email-templates/reservation-accepted-it";
import reservationAcceptedEN from "~/email-templates/reservation-accepted-en";
import reservationCancelledIT from "~/email-templates/reservation-cancelled-it";
import reservationCancelledEN from "~/email-templates/reservation-cancelled-en";

export default defineEventHandler(async (event) => {
	const isProduction = process.env.NODE_ENV === 'production'
	if (isProduction) throw Error

	const { emailType } = getQuery(event);

	switch (emailType) {
		case 'acceptedIt':
			return reservationAcceptedIT({ restaurant: {} })
		case 'acceptedEn':
			return reservationAcceptedEN({ restaurant: {} })
		case 'cancelledIt':
			return reservationCancelledIT({ restaurant: {} })
		case 'cancelledEn':
			return reservationCancelledEN({ restaurant: {} })
	}
})