// ********************** FACEBOOK EVENTS **********************
// https://www.facebook.com/business/help/402791146561655?id=1205376682832142
// *************************************************************

// ***************** GOOGLE ANALYTICS PACKAGE ******************
// https://github.com/johannschopplich/nuxt-gtag
// *************************************************************
import { useNuxtApp } from '#app';

export function useEventTracking() {

	function trackEventReservationStarted(restaurantName: string) {
		const nuxtApp = useNuxtApp()
		// @ts-ignore
		nuxtApp.$fb.track("InitiateCheckout", { content_name: restaurantName })

		const { gtag } = useGtag()
		gtag("event", "reservation_started", {
			event_category: "reservation",
			event_action: "started",
		});
	}

	function trackEventReservationFinished(restaurantName: string, value: number, reservationId: string) {
		const nuxtApp = useNuxtApp()
		// @ts-ignore
		nuxtApp.$fb.track("Schedule", { content_name: restaurantName, currency: "EUR", value })

		const { gtag } = useGtag()
		gtag("event", "reservation_finished", {
			event_category: "reservation",
			event_action: "finished",
			value,
			currency: 'EUR',
		});
		gtag("event", "purchase", {
			transaction_id: reservationId,
			value,
			currency: 'EUR',
		});
	}

	return { trackEventReservationStarted, trackEventReservationFinished };
}