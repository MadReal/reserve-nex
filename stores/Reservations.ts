import { storeToRefs } from "pinia";
import { useRestaurantsStore } from "~/stores/Restaurants";
import { lunch, dinner } from "~/data/work-times-available.json";

const URL = "/api/reservations";

// Define a reusable function

export const useReservationsStore = defineStore("ReservationsStore", () => {
	const storeRestaurants = useRestaurantsStore();
	const { activeRestaurantId } = storeToRefs(storeRestaurants);

	// STATE
	const reservationsList = ref<Reservation[]>([]);
	const reservationsSearchList = ref<Reservation[]>([]);

	// ACTIONS
	async function fetchReservations(searchQuery?: string) {
		const queryParams = {
			restaurantId: activeRestaurantId.value,
			searchQuery: searchQuery,
		};

		const { data, error } = await useFetch<Reservation[]>(URL, {
			params: queryParams,
		});
		if (data && data.value) {
			// Sort the list by date and time
			const reservationsSorted = data.value.sort(
				(a: Reservation, b: Reservation) => {
					// Parse dates as Date objects
					const dateA = new Date(a.date);
					const dateB = new Date(b.date);

					// Compare dates
					if (dateA < dateB) return -1; // a comes before b
					if (dateA > dateB) return 1; // a comes after b

					// If dates are equal, compare times
					const timeA = a.time.split(":").map(Number);
					const timeB = b.time.split(":").map(Number);

					if (timeA[0] < timeB[0]) return -1; // a comes before b
					if (timeA[0] > timeB[0]) return 1; // a comes after b

					// If hours are equal, compare minutes
					if (timeA[1] < timeB[1]) return -1; // a comes before b
					if (timeA[1] > timeB[1]) return 1; // a comes after b

					// If both date and time are equal
					return 0;
				}
			);
			if (searchQuery) reservationsSearchList.value = reservationsSorted;
			else reservationsList.value = reservationsSorted;
			return reservationsSorted;
		}
	}

	async function addReservation(reservation: Partial<Reservation>) {
		const { data, error } = await useFetch<Reservation>(URL, {
			method: "post",
			body: reservation,
		});
		// if (data && data.value) return reservationsList.value.push(data.value);
		if (data && data.value) return data.value;
	}

	async function updateReservation(
		reservationId: Reservation["id"],
		accepted: Reservation["accepted"]
	) {
		await useFetch(`${URL}/${reservationId}`, {
			method: "patch",
			body: { accepted },
		});
		const reservationToUpdateIndex = reservationsList.value.findIndex(
			(e) => e.id === reservationId
		);
		reservationsList.value[reservationToUpdateIndex].accepted = accepted;
	}

	return {
		reservationsList,
		reservationsSearchList,
		fetchReservations,
		addReservation,
		updateReservation,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(
		acceptHMRUpdate(useReservationsStore, import.meta.hot)
	);
}
