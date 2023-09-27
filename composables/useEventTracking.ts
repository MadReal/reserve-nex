import { useNuxtApp } from '#app';

// ********************** FACEBOOK EVENTS **********************
// https://www.facebook.com/business/help/402791146561655?id=1205376682832142
// *************************************************************

export function useEventTracking() {

	function trackEvent(eventName: string, eventParams?: any) {
		const nuxtApp = useNuxtApp()
		console.log('trackEvent');
		// @ts-ignore
		nuxtApp.$fb.track(eventName, eventParams)
	}

	return { trackEvent };
}
