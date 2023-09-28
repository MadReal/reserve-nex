// ********************** FACEBOOK EVENTS **********************
// https://www.facebook.com/business/help/402791146561655?id=1205376682832142
// *************************************************************

// ***************** GOOGLE ANALYTICS PACKAGE ******************
// https://github.com/johannschopplich/nuxt-gtag
// *************************************************************
import { useNuxtApp } from '#app';

export function useEventTracking() {

	function trackEvent(eventName: string, eventParams?: any) {
		const nuxtApp = useNuxtApp()
		// const { gtag } = useGtag()

		// @ts-ignore
		nuxtApp.$fb.track(eventName, eventParams)

		// gtag('event', 'screen_view', {
		// 	app_name: 'My App',
		// 	screen_name: 'Home'
		// })
	}

	return { trackEvent };
}
