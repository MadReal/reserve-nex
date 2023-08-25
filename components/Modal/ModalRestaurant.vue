<script setup lang="ts">

</script>


<template lang="pug">
.flex.items-center.justify-center.h-full
	.text-center.basis-full
		p.text-lg.font-semibold.mb-4 Aggiungi Ristorante
		input.h-10.p-3.rounded-lg.border(class="w-10/12", type="text", placeholder="Nome del ristorante")

		.flex.items-center.justify-center.gap-2.mt-4
			button.py-2.px-4.bg-primary-200.text-white.rounded-lg.hover_shadow Aggiungi
			//- button.py-3.px-4.bg-primary-200.text-white.rounded-lg Modifica
			//- button.py-3.px-4.bg-error-200.text-white.rounded-lg Elimina
</template>