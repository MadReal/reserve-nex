const URL = "/api/restaurants";

import { useLoadAllData } from "~/composables/useLoadAllData";

export const useRestaurantsStore = defineStore("RestaurantsStore", () => {
  const storeNotifications = useNotificationsStore();

  // STATE
  const restaurantsList = ref<Restaurant[]>([]);
  let activeRestaurantId = ref<Restaurant["id"] | null>();

  // GETTERS
  const activeRestaurant = computed(() => restaurantsList.value.filter((item) => item.id === activeRestaurantId.value,)[0]);

  const restaurantsListFilterIsLive = computed(() => restaurantsList.value.filter((item) => item.isLive));

  // ACTIONS
  function switchActiveResturant(newId: number) {
    activeRestaurantId.value = newId;
    // Call the loadAdminInitData function to reload all data after switching active restaurant
    const { loadAdminInitData } = useLoadAllData();
    loadAdminInitData();
  }

  async function fetchRestaurants() {
    const { data, error }: any = await useFetch(URL);
    const fetchedRestaurants: Restaurant[] = data.value;
    if (fetchedRestaurants) {
      restaurantsList.value = fetchedRestaurants;
      // if current active restuarant id is not part of the list (maybe restuarant was deleted by cookie still has old ID)
      const isActiveRestaurantIdInsideFetched = fetchedRestaurants.some((item) => item.id === activeRestaurantId.value,);
      // set new activce restuarant id to null => user goes to /restuarant page to set new active one
      if (!isActiveRestaurantIdInsideFetched && fetchedRestaurants.length >= 1)
        activeRestaurantId.value = null;
      // set active restaurant automatically if only 1 in the list
      if (fetchedRestaurants.length === 1)
        activeRestaurantId.value = data.value[0].id;
    } else if (error) throw error.value;
  }

  async function fetchSingleRestaurant(restaurantId: Restaurant["id"]) {
    const { data, error } = await useFetch<Restaurant>(`${URL}/${restaurantId}`);
    if (data && data.value) {
      restaurantsList.value = [data.value];
      activeRestaurantId.value = data.value.id;
      return data.value;
    } else if (error) throw error.value;
  }

  async function addOrUpdateRestaurant(restaurant: Restaurant, restaurantId: Restaurant["id"] | null) {
    if (restaurantId) {
      const { data, error } = await useFetch<Restaurant>(`${URL}/${restaurantId}`, {
        method: "patch",
        body: { name: restaurant.name, address: restaurant.address, city: restaurant.city, zipCode: restaurant.zipCode, isLive: restaurant.isLive },
      },
      );
      const restuarantToUpdateIndex = restaurantsList.value.findIndex((e) => e.id === restaurantId);
      if (data && data.value) {
        restaurantsList.value[restuarantToUpdateIndex] = data.value;
        storeNotifications.openNotification("Modifiche apportate.");
      } else if (error) throw error.value;
    } else {
      // is new restaurant name === a name that already exists in DB
      if (restaurantsList.value.some((item) => item.name === restaurant.name))
        throw new Error("Esiste già un ristorante con questo nome.");
      const { data, error } = await useFetch<Restaurant>(URL, { method: "post", body: restaurant });
      if (data && data.value) {
        restaurantsList.value.push(data.value);
        activeRestaurantId.value = data.value.id;
        storeNotifications.openNotification("Ristorante creato.");
      } else if (error) throw error.value;
    }
  }

  async function removeRestaurant(restaurantId: Restaurant["id"]) {
    await useFetch(`${URL}/${restaurantId}`, { method: "delete" });
    const RestaurantToRemoveIndex = restaurantsList.value.findIndex(e => e.id === restaurantId,);
    restaurantsList.value.splice(RestaurantToRemoveIndex, 1);
    // set another Active Restaurant // TODO; redirect if there are no more
    activeRestaurantId.value = restaurantsList.value[0].id;
  }

  return {
    restaurantsList,
    restaurantsListFilterIsLive,
    activeRestaurantId,
    activeRestaurant,
    switchActiveResturant,
    fetchSingleRestaurant,
    fetchRestaurants,
    addOrUpdateRestaurant,
    removeRestaurant,
  };
},
  {
    // https://github.com/prazdevs/pinia-plugin-persistedstate
    persist: {
      storage: persistedState.localStorage,
      paths: ["restaurantsList", "activeRestaurantId", "activeRestaurant"],
    },
  },
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRestaurantsStore, import.meta.hot));
}
