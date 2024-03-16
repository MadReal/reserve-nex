export const useNotificationsStore = defineStore("NotificationsStore", () => {
  // STATE
  const activeNotification = ref<{ text: string; isSuccess: boolean } | null>(null)

  // ACTIONS
  function openNotification(text: string, isSuccess: boolean = true) {
    activeNotification.value = { text, isSuccess }
    setTimeout(() => closeNotification(), 5000)
  }

  function closeNotification() {
    activeNotification.value = null
  }

  return { activeNotification, openNotification, closeNotification }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useNotificationsStore, import.meta.hot))
