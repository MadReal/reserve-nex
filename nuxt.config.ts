import svgLoader from "vite-svg-loader";

// https://nuxt.com/docs/api/configuration/nuxt-config
// https://nuxt.com/docs/guide/concepts/rendering#hybrid-rendering

export default defineNuxtConfig({
	devtools: { enabled: true },
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
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	modules: [
		"@nuxt/image",
		"@nuxtjs/supabase",
		["@pinia/nuxt", { autoImports: ["defineStore", "acceptHMRUpdate"] }],
		"@pinia-plugin-persistedstate/nuxt",
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
	image: { provider: "netlify", format: ["webp", "jpg"] },
	vite: { plugins: [svgLoader()] },
});
