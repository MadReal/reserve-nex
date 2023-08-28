<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useModalsStore } from '~/stores/Modals'
import { useRestaurantsStore } from '~/stores/Restaurants'

const storeModals = useModalsStore()
const storeRestaurants = useRestaurantsStore()
const { activeModalOption } = storeToRefs(storeModals)
const { restaurantsList } = storeToRefs(storeRestaurants)

const modalRestaurantName = ref('');
const selectedRestaurant = ref(restaurantsList.value.filter((item: Restaurant) => item.id === activeModalOption.value)[0])
// Set the initial value of modalRestaurantName based on activeRestaurant
const initialEditedRestaurantName = computed(() => selectedRestaurant.value ? selectedRestaurant.value.name : '');
modalRestaurantName.value = initialEditedRestaurantName.value

let modalError = ref('')
const addOrUpdateRestaurant = async () => {
	if (!modalRestaurantName.value) modalError.value = 'Scrivi un nome valido'
	else {
		await storeRestaurants.addOrUpdateRestaurant(modalRestaurantName.value, selectedRestaurant?.value?.id)
		modalError.value = ''
		storeModals.closeModal()
	}
}
const removeRestaurant = async () => {
	if (confirm('Sicuro di voler eliminare il ristorante?')) {
		await storeRestaurants.removeRestaurant(selectedRestaurant.value.id)
		modalError.value = ''
		storeModals.closeModal()
	}
}
</script>


<template lang="pug">
.flex.items-center.justify-center.h-full
	.text-center.basis-full
		p.text-lg.font-semibold.mb-4 {{ selectedRestaurant ? 'Modifica Ristorante' : 'Aggiungi Ristorante'}}
		input.h-10.p-3.rounded-lg.border(class="w-10/12", :class="{ 'border-error-200 placeholder_text-error-100' : modalError }", 
			type="text", placeholder="Nome del ristorante", v-model="modalRestaurantName")
		p.mt-2.text-sm.text-error-200 {{ modalError || '' }}

		.flex.items-center.justify-center.gap-2.mt-4
			button.py-3.px-4.bg-primary-200.text-white.rounded-lg.hover_shadow(@click="addOrUpdateRestaurant") {{ selectedRestaurant ? 'Modifica Nome' : 'Aggiungi' }}
			button.py-3.px-4.bg-error-200.text-white.rounded-lg.hover_shadow(v-if="selectedRestaurant", @click="removeRestaurant") Elimina Ristorante
</template>