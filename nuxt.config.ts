// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	css: ["~/assets/css/main.sass"],
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	modules: [
		"@nuxt/image",
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
});
