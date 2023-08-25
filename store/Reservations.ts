const URL = "/api/reservations";

export const useReservationsStore = defineStore("ReservationsStore", () => {
	// STATE
	const reservationsList = ref<Reservation[]>([]);

	// GETTERS

	// ACTIONS
	async function fetchResevations() {
		const { data, error }: any = await useFetch(URL);
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
			reservationsList.value = reservationsSorted;
		}
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
		fetchResevations,
		updateReservation,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(
		acceptHMRUpdate(useReservationsStore, import.meta.hot)
	);
}
