<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useModalsStore } from '~/stores/Modals'
import { vOnClickOutside } from '@vueuse/components'

const storeModals = useModalsStore()
const { activeModal } = storeToRefs(storeModals)

watch(() => activeModal.value, () => {
	if (activeModal.value) document.body.classList.add('overflow-hidden')
	else document.body.classList.remove('overflow-hidden')
})
</script>


<template>
	<div class="modalManager flex items-center justify-center absolute inset-0 z-50 overflow-y-scroll bg-black/80"
		v-if="activeModal !== null">
		<div class="relative w-11/12 lg_w-4/12 lg_min-w-[36rem] bg-white rounded-lg border overflow-y-clip border-slate-100 py-8 px-6 md_p-12 md_pb-16"
			v-on-click-outside="storeModals.closeModal">
			<div class="absolute top-3 right-3 rounded-full border border-black cursor-pointer hover_bg-slate-100 p-0.5">
				<SVGIcon class="text-black" svg="close" :size="24" @click="storeModals.closeModal()" />
			</div>
			<ModalRestaurant v-if="activeModal === 'restaurant'"></ModalRestaurant>
			<ModalReservation v-else-if="activeModal === 'reservation'"></ModalReservation>
		</div>
	</div>
</template>