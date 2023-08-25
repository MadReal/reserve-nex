<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useModalsStore } from '~/store/Modals'
import { useRestaurantsStore } from '~/store/Restaurants'

const storeModals = useModalsStore()
const storeRestaurants = useRestaurantsStore()
const { activeModalOption } = storeToRefs(storeModals)
const { activeRestaurant } = storeToRefs(storeRestaurants)


const editedRestaurantName = ref('');

// Set the initial value of editedRestaurantName based on activeRestaurant
const initialEditedRestaurantName = computed(() => {
	if (activeRestaurant.value) return activeRestaurant.value.name;
	else return '';
});

editedRestaurantName.value = initialEditedRestaurantName.value;

</script>


<template lang="pug">
.flex.items-center.justify-center.h-full
	.text-center.basis-full
		p.text-lg.font-semibold.mb-4 {{ activeModalOption === 'isNew' ? 'Aggiungi Ristorante' : 'Modifica Ristorante' }}
		input.h-10.p-3.rounded-lg.border(class="w-10/12", type="text", placeholder="Nome del ristorante", v-model="editedRestaurantName")

		.flex.items-center.justify-center.gap-2.mt-4
			template(v-if="activeModalOption === 'isNew'")
				button.py-3.px-4.bg-primary-200.text-white.rounded-lg.hover_shadow Aggiungi
			template(v-if="activeModalOption === 'isEdit'")
				button.py-3.px-4.bg-primary-200.text-white.rounded-lg.hover_shadow Modifica Nome
				button.py-3.px-4.bg-error-200.text-white.rounded-lg.hover_shadow Elimina Ristorante
</template>