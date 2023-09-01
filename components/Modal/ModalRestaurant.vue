<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useModalsStore } from '~/stores/Modals'
import { useRestaurantsStore } from '~/stores/Restaurants'

const storeModals = useModalsStore()
const storeRestaurants = useRestaurantsStore()
const { activeModalOption } = storeToRefs(storeModals)
const { restaurantsList } = storeToRefs(storeRestaurants)

const modalRestaurant = ref({
	name: '',
	address: '',
	city: '',
	zipCode: null,
});
const selectedRestaurant = ref(restaurantsList.value.filter((item: Restaurant) => item.id === activeModalOption.value)[0])
// Set the initial value of modalRestaurant based on activeRestaurant
const initialEditedRestaurantName = computed(() => selectedRestaurant.value ? selectedRestaurant.value.name : '');
modalRestaurant.value.name = initialEditedRestaurantName.value

let modalError = ref('')
const addOrUpdateRestaurant = async () => {
	if (!modalRestaurant.value) modalError.value = 'Scrivi un nome valido'
	else {
		await storeRestaurants.addOrUpdateRestaurant(modalRestaurant.value, selectedRestaurant?.value?.id)
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
		input.h-10.p-3.rounded-lg.border(class="w-full lg_w-10/12", :class="{ 'border-error-200 placeholder_text-error-100' : modalError }", 
			type="text", placeholder="Nome del ristorante", v-model="modalRestaurant.name")
		p.mt-2.text-sm.text-error-200 {{ modalError || '' }}

		.flex.items-center.justify-center.gap-2.mt-4
			button.py-2.px-4.bg-primary-200.text-white.rounded.hover_shadow(@click="addOrUpdateRestaurant") {{ selectedRestaurant ? 'Modifica Nome' : 'Aggiungi' }}
			button.py-2.px-4.bg-error-200.text-white.rounded.hover_shadow(v-if="selectedRestaurant", @click="removeRestaurant") Elimina Ristorante
</template>