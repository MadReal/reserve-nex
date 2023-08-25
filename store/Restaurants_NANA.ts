// import { defineStore } from "pinia";

// const URL = "/api/restaurants";

// export const useRestaurantsStore = defineStore("RestaurantsStore", {
// 	state: () => {
// 		return {
// 			restaurantsList: [] as Restaurant[],
// 		};
// 	},
// 	actions: {
// 		async fetchRestaurants() {
// 			const { data, error }: any = await useFetch(URL);
// 			if (data && data.value) this.restaurantsList = data.value;
// 		},
// 	},
// });
