<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNotificationsStore } from '~/stores/Notifications'
import { vOnClickOutside } from '@vueuse/components'

const storeNotifications = useNotificationsStore()
const { activeNotification } = storeToRefs(storeNotifications)
</script>


<template>
	<Transition>
		<div class="NotificationManager z-50 shadow absolute bottom-4 inset-x-2 md_left-auto bg-green-400 text-white rounded-lg py-2 px-3 md_px-4 flex items-center md_bottom-10 md_right-7 w-auto lg_min-w-[300px] "
			v-if="activeNotification !== null">
			<p class="text-sm"> {{ activeNotification?.text }} </p>
			<div class="ml-6 cursor-pointer p-1 rounded-lg hover_bg-green-500"
				@click="storeNotifications.closeNotification()">
				<SVGIcon class="" svg="close" :size="24" />
			</div>
		</div>
	</Transition>
</template>


<style>
/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
	transition: all 0.5s ease;
}

.v-enter-from,
.v-leave-to {
	transform: translateX(200px);
	opacity: 0;
}
</style>