<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'empty-restaurants-list'], layout: 'admin-default' })

import Draggable from 'vuedraggable'

import { storeToRefs } from 'pinia'
import { useWorkTimesStore } from '~/stores/WorkTimes'
import { useDiscountsStore } from '~/stores/Discounts'

const storeWorkTimes = useWorkTimesStore();
storeWorkTimes.fetchWorkTimes()
const { lunchWorkTimesList, dinnerWorkTimesList } = storeToRefs(storeWorkTimes)

const storeDiscounts = useDiscountsStore();
storeDiscounts.fetchDiscountAmounts()
const { discountAmountsListOrdered } = storeToRefs(storeDiscounts)

const selectedDayOfWeek = ref(1)
</script>


<template>
	<div class="admin-page">
		<AdminPageTitle title="Gestione Orari" />
		<div class="grid grid-rows-[1fr_1px] lg_grid-rows-none lg_grid-cols-[3fr_1px_1fr]">
			<div>
				<div class="flex items-center mb-8 gap-2">
					<div class="py-1 px-2 text-black text-sm border rounded-md hover_border-grey-200 cursor-pointer"
						v-for="dayInt in 7" :key="dayInt"
						:class="{ 'border border-primary-100 text-primary-100 bg-primary-100/10': selectedDayOfWeek === dayInt }"
						@click="selectedDayOfWeek = dayInt">{{ useTranslateDayOfWeek(dayInt) }}</div>
				</div>
				<div
					class="grid gap-8 lg_gap-6 lg_border-b grid-rows-[1fr_1px_1fr] lg_grid-rows-none lg_grid-cols-[1fr_1px_1fr]">
					<div class="lg_mb-6">
						<p class="mb-4">Pranzo</p>
						<Draggable class="grid grid-cols-3 lg_grid-cols-4 gap-2" v-model="lunchWorkTimesList"
							group="universalGroup" itemKey="id" :sort="false">
							<template #item="{ element }">
								<AdminBoxDiscount :workTime="element" />
							</template>
						</Draggable>
					</div>
					<div class="border-b lg_border-r lg_border-b-0"></div>
					<div class="lg_mb-6">
						<p class="mb-4">Cena</p>
						<Draggable class="grid grid-cols-3 lg_grid-cols-4 gap-2" v-model="dinnerWorkTimesList"
							group="universalGroup" itemKey="id" :sort="false">
							<template #item="{ element }">
								<AdminBoxDiscount :workTime="element" />
							</template>
						</Draggable>
					</div>
				</div>
			</div>
			<div class="border-b lg_border-r lg_border-b-0"></div>
			<div class="lg_mb-6 pl-6">
				<p>Sconti</p>
				<p class="text-xs text-grey-100 mb-4">Aggiungi nuovi sconti e trascinali nell'ora che desideri.</p>
				<Draggable class="grid grid-cols-2 gap-2" v-model="discountAmountsListOrdered" group="universalGroup"
					itemKey="id">
					<template #item="{ element }">
						<p class="h-7 p-1 rounded bg-red-500 text-white text-sm text-center cursor-grab">{{
							element.amount }}%</p>
					</template>
				</Draggable>
			</div>
		</div>
	</div>
</template>