const URL_discountAmount = "/api/discount-amounts";
const URL_discount = "/api/discounts";

import { DiscountAmount } from "@prisma/client";
import { storeToRefs } from "pinia";

export const useDiscountsStore = defineStore("DiscountsStore", () => {
	const storeRestaurants = useRestaurantsStore();
	const { activeRestaurantId } = storeToRefs(storeRestaurants);

	// STATE
	const discountAmountsList = ref<DiscountAmount[]>([]);
	const discountsList = ref<Discount[]>([]);

	// GETTERS
	const discountAmountsListOrdered = computed(() =>
		discountAmountsList.value
			.slice()
			.sort((a: any, b: any) => a.value - b.value)
	);

	// ACTIONS
	async function fetchDiscountAmounts(restaurantId?: Restaurant["id"]) {
		const { data }: any = await useFetch(URL_discountAmount, {
			params: { restaurantId: restaurantId || activeRestaurantId },
		});
		if (data?.value) discountAmountsList.value = data.value;
	}

	async function fetchDiscounts(restaurantId?: Restaurant["id"]) {
		const { data }: any = await useFetch(URL_discount, {
			params: { restaurantId: restaurantId || activeRestaurantId },
		});
		if (data?.value) discountsList.value = data.value;
	}

	async function addDiscountAmount(value: DiscountAmount["value"]) {
		const { data, error } = await useFetch(URL_discountAmount, {
			method: "post",
			body: { value, restaurantId: activeRestaurantId },
		});
		// @ts-ignore
		if (data && data.value) discountAmountsList.value.push(data.value);
	}

	async function addDiscount(
		dayOfWeek: DayOfWeek,
		workTimeId: WorkTime["id"],
		discountAmountId: DiscountAmount["id"]
	) {
		const { data, error } = await useFetch(URL_discount, {
			method: "post",
			body: {
				dayOfWeek,
				discountAmountId: discountAmountId,
				workTimeId: workTimeId,
				restaurantId: activeRestaurantId,
			},
		});
		// @ts-ignore
		if (data && data.value) discountsList.value.push(data.value);
	}

	async function updateDiscount(
		discountId: Discount["id"],
		workTimeId: WorkTime["id"],
		discountAmountId?: DiscountAmount["id"]
	) {
		const { data } = await useFetch(`${URL_discount}/${discountId}`, {
			method: "patch",
			body: {
				discountAmountId: discountAmountId || null,
				workTimeId: workTimeId,
			},
		});
		if (data && data.value) {
			const discountToUpdateIndex = discountsList.value.findIndex(
				(e) => e.id === discountId
			);
			// @ts-ignore
			discountsList.value[discountToUpdateIndex] = data.value;
		}
	}

	async function deleteDiscountAmount(discountAmountId: DiscountAmount["id"]) {
		await useFetch(`${URL_discountAmount}/${discountAmountId}`, {
			method: "delete",
		});
		const discountAmountToRemoveIndex = discountsList.value.findIndex(
			(e) => e.id === discountAmountId
		);
		discountAmountsList.value.splice(discountAmountToRemoveIndex, 1);
	}

	async function deleteDiscount(discountId: Discount["id"]) {
		await useFetch(`${URL_discount}/${discountId}`, {
			method: "delete",
		});
		const discountToRemoveIndex = discountsList.value.findIndex(
			(e) => e.id === discountId
		);
		discountsList.value.splice(discountToRemoveIndex, 1);
	}

	return {
		discountAmountsList,
		discountAmountsListOrdered,
		discountsList,
		fetchDiscountAmounts,
		fetchDiscounts,
		addDiscountAmount,
		addDiscount,
		updateDiscount,
		deleteDiscountAmount,
		deleteDiscount,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useRestaurantsStore, import.meta.hot));
}
