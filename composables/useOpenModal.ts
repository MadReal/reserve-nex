import { useModalsStore } from "~/stores/Modals";

export function useOpenModal() {
	const storeModals = useModalsStore();

	function openModal(modalType: ModalType, id: number | string | null = null) {
		storeModals.openModal(modalType, id);
	}

	return { openModal };
}
