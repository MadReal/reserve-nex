const URL_discountAmount = "/api/discount-amounts";
const URL_discount = "/api/discount";

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
		discountAmount: DiscountAmount,
		workTime: WorkTime
	) {
		const { data, error } = await useFetch(URL_discount, {
			method: "post",
			body: {
				dayOfWeek,
				discountAmountId: discountAmount.id,
				workTimeId: workTime.id,
				restaurantId: activeRestaurantId,
			},
		});
		if (data && data.value) {
			const newDiscount = {
				id: data.value.id,
				dayOfWeek: data.value.dayOfWeek,
				value: discountAmount.value,
				discountAmountId: data.value.discountAmountId,
				workTime: { id: data.value.workTimeId, time: workTime.time },
				restaurantId: data.value.restaurantId,
			};
			// @ts-ignore
			discountsList.value.push(newDiscount);
		}
	}

	async function deleteDiscountAmount(discountAmountId: Discount["id"]) {
		await useFetch(`${URL_discountAmount}/${discountAmountId}`, {
			method: "delete",
		});
		const discountAmountToRemoveIndex = discountsList.value.findIndex(
			(e) => e.id === discountAmountId
		);
		discountAmountsList.value.splice(discountAmountToRemoveIndex, 1);
	}

	return {
		discountAmountsList,
		discountAmountsListOrdered,
		discountsList,
		fetchDiscountAmounts,
		fetchDiscounts,
		addDiscountAmount,
		addDiscount,
		deleteDiscountAmount,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useRestaurantsStore, import.meta.hot));
}
