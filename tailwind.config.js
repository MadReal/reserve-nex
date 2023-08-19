/** @type {import('tailwindcss').Config} */
module.exports = {
	separator: "_",
	content: [
		"./components/**/*.{js,vue,ts}",
		"./layouts/**/*.vue",
		"./pages/**/*.vue",
		"./plugins/**/*.{js,ts}",
		"./nuxt.config.{js,ts}",
		"./app.vue",
	],
	theme: {
		// transitionDuration: {
		// 	DEFAULT: "250ms",
		// },
		container: {
			center: true,
		},
		fontFamily: {
			sans: ["Poppins", "sans-serif"],
		},
		extend: {
			colors: {
				black: "#1F384C",
				white: "#fff",
				primary: {
					100: "#7F90FC",
					200: "#5A67BA",
				},
				grey: {
					100: "#C8CBD9",
					200: "#7F8F9E",
					300: "#4A5D6A",
				},
				success: {
					100: "#8DE2CB",
					200: "#0DBC8C",
					300: "#128C6B",
				},
				error: {
					100: "#F1A0A0",
					200: "#F06A6A",
					300: "#B52929",
				},
			},
		},
	},
	plugins: [],
};
