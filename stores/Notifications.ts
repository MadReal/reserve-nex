export const useNotificationsStore = defineStore("NotificationsStore", () => {
	// STATE
	const activeNotification = ref<{ text: string, color: string | null } | null>(null);

	// ACTIONS
	function openNotification(text: string, color?: string) {
		activeNotification.value = {
			text,
			color: color || null
		}
		setTimeout(() => closeNotification(), 5000);
	};

	function closeNotification() {
		activeNotification.value = null;
	}

	return {
		activeNotification,
		openNotification,
		closeNotification,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useNotificationsStore, import.meta.hot));
}
