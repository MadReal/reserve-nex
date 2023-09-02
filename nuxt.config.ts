import svgLoader from "vite-svg-loader";

// https://nuxt.com/docs/api/configuration/nuxt-config
// https://nuxt.com/docs/guide/concepts/rendering#hybrid-rendering

export default defineNuxtConfig({
	devtools: { enabled: false },
	routeRules: {
		// Homepage pre-rendered at build time
		"/": { prerender: true },
		// Admin dashboard renders only on client-side
		"/admin/**": { ssr: false },
		// Add cors headers on API routes
		"/api/**": { cors: true },
	},
	build: { transpile: ["@vuepic/vue-datepicker"] },
	imports: { dirs: ["stores"] },
	css: ["~/assets/css/main.sass"],
	modules: [
		"@vueuse/nuxt",
		"@nuxt/image",
		"@nuxtjs/supabase",
		"@pinia-plugin-persistedstate/nuxt",
		["@pinia/nuxt", { autoImports: ["defineStore", "acceptHMRUpdate"] }],
		[
			"@nuxtjs/google-fonts",
			{
				families: { Poppins: [300, 400, 500, 600] },
				// preload: true,
				download: true,
				overwriting: false,
				display: "swap",
			},
		],
	],
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	supabase: { redirect: false },
	vite: { plugins: [svgLoader()] },
});
