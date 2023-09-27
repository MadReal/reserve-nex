export function useEventTracking() {

	function trackEvent() {
		console.log('trackEvent');

	}

	return { trackEvent };
}
