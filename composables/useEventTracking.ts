// ********************** FACEBOOK EVENTS **********************
// https://www.facebook.com/business/help/402791146561655?id=1205376682832142
// *************************************************************

// ***************** GOOGLE ANALYTICS PACKAGE ******************
// https://github.com/johannschopplich/nuxt-gtag
// *************************************************************
import { useNuxtApp } from '#app';

export function useEventTracking() {

	// function trackFacebookEvent(eventName: string, eventParams?: any) {
	// 	const nuxtApp = useNuxtApp()
	// 	// @ts-ignore
	// 	nuxtApp.$fb.track(eventName, eventParams)
	// }

	// function trackGoogleEvent(eventName: string, eventParams?: any) {
	// 	const { gtag } = useGtag()

	// 	gtag('event', 'screen_view', {
	// 		app_name: 'My App',
	// 		screen_name: 'Home'
	// 	})
	// }

	function trackEventReservationStarted(restaurantName: string) {
		const nuxtApp = useNuxtApp()
		// @ts-ignore
		nuxtApp.$fb.track("InitiateCheckout", { 'restaurant': restaurantName, content_name: restaurantName })

		const { gtag } = useGtag()
		gtag("event", "reservation_started", {
			event_category: "reservation",
			event_action: "started",
		});
	}

	function trackEventReservationFinished(restaurantName: string, value: number) {
		const nuxtApp = useNuxtApp()
		// @ts-ignore
		nuxtApp.$fb.track("Schedule", { 'restaurant': restaurantName, content_name: restaurantName, currency: "EUR", value })

		const { gtag } = useGtag()
		gtag("event", "reservation_finished", {
			event_category: "reservation",
			event_action: "finished",
			value,
			currency: 'EUR',
		});
	}

	// return { trackFacebookEvent, trackGoogleEvent, trackEventReservationStarted, trackEventReservationFinished };
	return { trackEventReservationStarted, trackEventReservationFinished };
}

// gtag("event", "reservation_started", {
// 	event_category: "reservation",
// 	event_action: "started",
// });

// gtag("event", "reservation_sent", {
// 	event_category: "reservation",
// 	event_action: "finished",
// 	value: clientReservationValueMinusDiscount,
// });