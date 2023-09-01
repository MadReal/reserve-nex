<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useModalsStore } from '~/stores/Modals'

const storeModals = useModalsStore()
const { activeModal } = storeToRefs(storeModals)
</script>


<template lang="pug">
div(v-if="activeModal !== null")
	.flex.items-center.justify-center.absolute.inset-0.z-20(class="bg-black/80")
		.relative(class="w-10/12 lg_w-4/12 lg_min-w-[36rem]").bg-white.rounded-lg.border.border-slate-100.p-12.pb-16
			.absolute.top-3.right-3.rounded-full.border.border-black.cursor-pointer.hover_bg-slate-100(class="p-0.5")
				SVGIcon.text-black(svg="close", :size="24" @click="storeModals.closeModal()")

			ModalRestaurant(v-if="activeModal === 'restaurant'")
			ModalReservation(v-else-if="activeModal === 'reservation'")
</template>