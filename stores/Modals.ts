export const useModalsStore = defineStore("ModalsStore", () => {
	// STATE
	const activeModal = ref<ModalType | null>(null);
	const activeModalOption = ref<any>(null);

	// ACTIONS
	function openModal(modalType: ModalType, options?: number | string | null) {
		activeModal.value = modalType;
		if (options) activeModalOption.value = options;
	}

	function closeModal() {
		activeModal.value = null;
		activeModalOption.value = null;
	}

	return { activeModal, activeModalOption, openModal, closeModal };
});

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useModalsStore, import.meta.hot));