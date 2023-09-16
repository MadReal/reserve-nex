import { useModalsStore } from "~/stores/Modals";

export function useOpenModal() {
	const storeModals = useModalsStore();

	function openModal(modalType: ModalType, restaurantId?: Restaurant["id"] = null) {
		storeModals.openModal(modalType, restaurantId);
	}

	return { openModal };
}
