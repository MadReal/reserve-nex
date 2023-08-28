<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useModalsStore } from '~/stores/Modals'

const storeModals = useModalsStore()
const { activeModal } = storeToRefs(storeModals)
</script>


<template lang="pug">
div(v-if="activeModal !== null")
	.flex.items-center.justify-center.absolute.inset-0.z-20(class="bg-white/80")
		.relative(class="w-5/12").min-h-80.bg-white.rounded-lg.border.border-slate-100.py-12.px-8.shadow-lg.shadow-gray-100
			.absolute.top-3.right-3.rounded-full.border.border-black.cursor-pointer.hover_bg-slate-100(class="p-0.5")
				SVGIcon.text-black(svg="close", :size="24" @click="storeModals.closeModal()")

			ModalRestaurant(v-if="activeModal === 'restaurant'")
			ModalReservation(v-else-if="activeModal === 'reservation'")
</template>