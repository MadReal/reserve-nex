const URL_discountAmount = "/api/discount-amounts";
const URL_discount = "/api/discounts";
const URL_discountDayOfWeek = `${URL_discount}/day-of-week`;

import { storeToRefs } from "pinia";

export const useDiscountsStore = defineStore("DiscountsStore", () => {

	const storeNotifications = useNotificationsStore();
	const storeRestaurants = useRestaurantsStore();
	const storeAuth = useAuthStore();
	const { activeRestaurantId } = storeToRefs(storeRestaurants);
	const { authToken } = storeToRefs(storeAuth);

	// STATE
	const discountAmountsList = ref<DiscountAmount[]>([]);
	const discountsList = ref<Discount[]>([]);

	// GETTERS
	const discountAmountsListOrdered = computed(() => discountAmountsList.value.slice().sort((a: any, b: any) => a.value - b.value));

	// ACTIONS
	async function fetchDiscountAmounts(restaurantId?: Restaurant["id"]) {
		const { data, error } = await useFetch<DiscountAmount[]>(URL_discountAmount, {
			params: { restaurantId: restaurantId || activeRestaurantId.value },
		});
		if (data?.value) discountAmountsList.value = data.value;
		else if (error) throw error.value
	}

	async function fetchDiscounts(restaurantId?: Restaurant["id"]) {
		const { data, error } = await useFetch<Discount[]>(URL_discount, {
			params: { restaurantId: restaurantId || activeRestaurantId.value },
		});
		if (data?.value) discountsList.value = data.value;
		else if (error) throw error.value
	}

	async function fetchDiscountsByDayOfWeek(dayOfWeek: DayOfWeek, restaurantId?: Restaurant["id"]) {
		const { data, error } = await useFetch<Discount[]>(URL_discount, {
			params: { dayOfWeek, restaurantId: restaurantId || activeRestaurantId.value },
		});
		if (data?.value) discountsList.value = data.value;
		else if (error) throw error.value
	}

	async function addDiscountAmount(value: DiscountAmount["value"]) {
		const { data, error } = await useFetch<DiscountAmount>(URL_discountAmount, {
			method: "post",
			headers: { Authorization: authToken.value ? `Bearer ${authToken.value}` : '' },
			body: { value, restaurantId: activeRestaurantId.value },
		});
		if (data && data.value) discountAmountsList.value.push(data.value);
		else if (error) throw error.value
	}

	async function addDiscount(dayOfWeek: DayOfWeek, workTimeId: WorkTime["id"], discountAmountId: DiscountAmount["id"]) {
		const { data, error } = await useFetch<Discount>(URL_discount, {
			method: "post",
			headers: { Authorization: authToken.value ? `Bearer ${authToken.value}` : '' },
			body: { dayOfWeek, discountAmountId: discountAmountId, workTimeId: workTimeId, restaurantId: activeRestaurantId.value, },
		});
		if (data && data.value) discountsList.value.push(data.value);
		else if (error) throw error.value
	}

	async function addManyDiscounts(dayOfWeek: DayOfWeek, discountAmountId: DiscountAmount["id"], workTimeId?: WorkTime["id"]) {
		const { data, error } = await useFetch<Discount[]>(URL_discountDayOfWeek, {
			method: "post",
			headers: { Authorization: authToken.value ? `Bearer ${authToken.value}` : '' },
			body: { dayOfWeek, discountAmountId: discountAmountId, workTimeId, restaurantId: activeRestaurantId.value, },
		});
		if (data && data.value) {
			// replace them all with the new list returned
			if (dayOfWeek === 10) {
				discountsList.value = data.value;
				storeNotifications.openNotification('Sconti applicati correttamente a tutti gli orari.')
			}
			// otherwises remove discount that have dayOfWeek === param.dayOfWeek
			else {
				discountsList.value
					.filter((x) => x.dayOfWeek === dayOfWeek)
					.forEach((x) => discountsList.value.splice(discountsList.value.indexOf(x), 1));

				data.value.forEach((element) => discountsList.value.push(element));
			}
		}
		else if (error) throw error.value
	}

	async function updateDiscount(discountId: Discount["id"], workTimeId: WorkTime["id"], discountAmountId?: DiscountAmount["id"]) {
		const { data, error } = await useFetch<Discount>(`${URL_discount}/${discountId}`, {
			method: "patch",
			headers: { Authorization: authToken.value ? `Bearer ${authToken.value}` : '' },
			body: { discountAmountId: discountAmountId || null, workTimeId: workTimeId },
		});
		if (data && data.value) {
			const discountToUpdateIndex = discountsList.value.findIndex((e) => e.id === discountId);
			discountsList.value[discountToUpdateIndex] = data.value;
		}
		else if (error) throw error.value
	}

	async function deleteDiscountAmount(discountAmountId: DiscountAmount["id"]) {
		const { status } = await useFetch(`${URL_discountAmount}/${discountAmountId}`, { method: "delete", headers: { Authorization: authToken.value ? `Bearer ${authToken.value}` : '' } });
		if (status.value === 'error') return storeNotifications.openNotification("Errore nell'eliminazione, riprova più tardi.", false)

		const discountAmountToRemoveIndex = discountAmountsList.value.findIndex((e) => e.id === discountAmountId);
		discountAmountsList.value.splice(discountAmountToRemoveIndex, 1);
	}

	async function deleteDiscount(discountId: Discount["id"]) {
		const { status } = await useFetch(`${URL_discount}/${discountId}`, { method: "delete", headers: { Authorization: authToken.value ? `Bearer ${authToken.value}` : '' } });
		if (status.value === 'error') return storeNotifications.openNotification("Errore nell'eliminazione, riprova più tardi.", false)

		const discountToRemoveIndex = discountsList.value.findIndex((e) => e.id === discountId);
		discountsList.value.splice(discountToRemoveIndex, 1);
	}

	async function deleteAllDiscountsOnDayOfWeek(dayOfWeek: Discount["dayOfWeek"]) {
		const { status } = await useFetch(`${URL_discountDayOfWeek}?dayOfWeek=${dayOfWeek}&restaurantId=${activeRestaurantId.value}`, { method: "delete", headers: { Authorization: authToken.value ? `Bearer ${authToken.value}` : '' } });
		if (status.value === 'error') return storeNotifications.openNotification("Errore nell'eliminazione, riprova più tardi.", false)

		// remove locally, if ALL remove everything
		if (dayOfWeek === 10) discountsList.value = [];
		// otherwises remove discount that have dayOfWeek === param.dayOfWeek
		else discountsList.value.filter((x) => x.dayOfWeek === dayOfWeek).forEach((x) => discountsList.value.splice(discountsList.value.indexOf(x), 1));
	}

	return {
		discountAmountsList,
		discountAmountsListOrdered,
		discountsList,
		fetchDiscountAmounts,
		fetchDiscounts,
		fetchDiscountsByDayOfWeek,
		addDiscountAmount,
		addDiscount,
		addManyDiscounts,
		updateDiscount,
		deleteDiscountAmount,
		deleteDiscount,
		deleteAllDiscountsOnDayOfWeek,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useRestaurantsStore, import.meta.hot));
}
