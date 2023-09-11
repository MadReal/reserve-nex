<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useModalsStore } from '~/stores/Modals'
import { useRestaurantsStore } from '~/stores/Restaurants'

const storeModals = useModalsStore()
const storeRestaurants = useRestaurantsStore()
const { activeModalOption } = storeToRefs(storeModals)
const { restaurantsList } = storeToRefs(storeRestaurants)

const modalRestaurant = ref();

const selectedRestaurant = ref(restaurantsList.value.filter((item: Restaurant) => item.id === activeModalOption.value)[0])
// Set the initial value of modalRestaurant based on activeRestaurant
const initialEditedRestaurantName = computed(() => selectedRestaurant.value || {
	name: '',
	address: '',
	city: '',
	zipCode: null,
	isLive: false,
});

modalRestaurant.value = initialEditedRestaurantName.value

let modalError = ref('')
const addOrUpdateRestaurant = async () => {
	if (!modalRestaurant.value || !modalRestaurant.value.name || !modalRestaurant.value.name || !modalRestaurant.value.address || !modalRestaurant.value.city || !modalRestaurant.value.zipCode) {
		return modalError.value = 'Completa tutte le field.';
	}
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
	.basis-full.mx-auto
		p.text-lg.font-semibold.mb-4.text-center {{ selectedRestaurant ? 'Modifica Ristorante' : 'Aggiungi Ristorante'}}


		.w-full.mb-2
			label.text-xs.text-grey-200(for="name") Nome
			input.w-full.h-10.text-xs.rounded-md.py-1.px-2.border.text-black.placeholder_text-grey-100.focus_border-grey-200.focus_outline-none(
				:class="{ 'border-error-200 placeholder_text-error-100' : modalError }",
				v-model="modalRestaurant.name", name="name", id="name", type="text", placeholder="Nome*", required)

		.w-full.flex.gap-2.mb-4
			.basis-36
				label.text-xs.text-grey-200(for="city") Città
				input.w-full.h-10.text-xs.rounded-md.py-1.px-2.border.text-black.placeholder_text-grey-100.focus_border-grey-200.focus_outline-none(
					:class="{ 'border-error-200 placeholder_text-error-100' : modalError }",
					v-model="modalRestaurant.city", name="city", id="city", type="text", placeholder="Città*", autocomplete="city" required)

			.flex-grow
				label.text-xs.text-grey-200(for="address") Indirizzo
				input.w-full.h-10.text-xs.rounded-md.py-1.px-2.border.text-black.placeholder_text-grey-100.focus_border-grey-200.focus_outline-none(
					:class="{ 'border-error-200 placeholder_text-error-100' : modalError }",
					v-model="modalRestaurant.address", name="address", id="address", type="text", placeholder="Nome*", required)

			.basis-28
				label.text-xs.text-grey-200(for="zip-code") CAP
				input.w-full.h-10.text-xs.rounded-md.py-1.px-2.border.text-black.placeholder_text-grey-100.focus_border-grey-200.focus_outline-none(
					:class="{ 'border-error-200 placeholder_text-error-100' : modalError }",
					v-model.number="modalRestaurant.zipCode", name="zip-code", id="zip-code", type="text", placeholder="CAP*", autocomplete="name" required)

		.flex.items-center.mb-2
			input.w-4.h-4.border.border-grey-200.rounded.cursor-pointer.focus_ring-0(id="isLive" type="checkbox" v-model="modalRestaurant.isLive")
			label.pl-2.text-xs.text-grey-200.cursor-pointer(for="isLive") Visibile ai clienti

		p.mt-2.text-sm.text-error-200.text-center {{ modalError || '' }}

		.flex.items-center.justify-center.gap-3.mt-5.text-sm.md_text-base
			button.p-2.bg-primary-200.text-white.rounded.hover_shadow(@click="addOrUpdateRestaurant") {{ selectedRestaurant ? 'Modifica' : 'Aggiungi' }}
			button.p-2.bg-error-200.text-white.rounded.hover_shadow(v-if="selectedRestaurant", @click="removeRestaurant") Elimina Ristorante
</template>