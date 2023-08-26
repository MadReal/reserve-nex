<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useModalsStore } from '~/store/Modals'
import { useRestaurantsStore } from '~/store/Restaurants'

const storeModals = useModalsStore()
const storeRestaurants = useRestaurantsStore()
const { activeModalOption } = storeToRefs(storeModals)
const { restaurantsList, activeRestaurant } = storeToRefs(storeRestaurants)

const modelRestaurantName = ref('');
// Set the initial value of modelRestaurantName based on activeRestaurant
const initialEditedRestaurantName = computed(() => activeRestaurant.value ? activeRestaurant.value.name : '');
modelRestaurantName.value = activeModalOption.value ? restaurantsList.value.filter(activeModalOption.value)[0].name : initialEditedRestaurantName.value;

let modalError = ref('')
const addRestaurant = () => {
	if (!modelRestaurantName.value) modalError.value = 'Scrivi un nome valido'
	else {
		storeRestaurants.addRestaurant(modelRestaurantName.value)
		modalError.value = ''
	}
}
const removeRestaurant = () => {
	if (confirm('Sicuro di voler eliminare il ristorante?')) {
		storeRestaurants.removeRestaurant(activeRestaurant.value.id)
		modalError.value = ''
	}
}
</script>


<template lang="pug">
.flex.items-center.justify-center.h-full
	.text-center.basis-full
		p.text-lg.font-semibold.mb-4 {{ activeModalOption === 'isNew' ? 'Aggiungi Ristorante' : 'Modifica Ristorante' }}
		input.h-10.p-3.rounded-lg.border(class="w-10/12", :class="{ 'border-error-200 placeholder_text-error-100' : modalError }", 
			type="text", placeholder="Nome del ristorante", v-model="modelRestaurantName")
		p.mt-2.text-sm.text-error-200 {{ modalError || '' }}

		.flex.items-center.justify-center.gap-2.mt-4
			template(v-if="!activeModalOption")
				button.py-3.px-4.bg-primary-200.text-white.rounded-lg.hover_shadow(@click="addRestaurant") Aggiungi
			template(v-else)
				button.py-3.px-4.bg-primary-200.text-white.rounded-lg.hover_shadow Modifica Nome
				button.py-3.px-4.bg-error-200.text-white.rounded-lg.hover_shadow(@click="removeRestaurant") Elimina Ristorante
</template>