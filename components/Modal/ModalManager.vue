<script setup lang="ts">

</script>


<template lang="pug">
.flex.items-center.justify-center.absolute.inset-0(class="bg-white/60")
	.relative(class="w-5/12").h-80.bg-white.rounded-lg.border.border-slate-100.py-12.px-8.shadow-xl.shadow-slate-50
		.absolute.top-3.right-3.rounded-full.border.border-black.cursor-pointer.hover_bg-slate-100
			SVGIcon.text-black(svg="close", :size="20")

		ModalRestaurant
</template>