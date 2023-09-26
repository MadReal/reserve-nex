export const useAuthStore = defineStore("AuthStore", () => {
  // STATE
  const authToken = ref<string>("");

  // ACTIONS
  function setAuthToken(token: string) {
    if (token) authToken.value = token;
  }

  return {
    authToken,
    setAuthToken,
  };
},
  {
    persist: {
      key: 'auth',
      storage: persistedState.cookies,
      paths: ["authToken"]
    },
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useModalsStore, import.meta.hot));
}
