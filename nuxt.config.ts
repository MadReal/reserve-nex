import svgLoader from "vite-svg-loader";

// https://nuxt.com/docs/api/configuration/nuxt-config
// https://nuxt.com/docs/guide/concepts/rendering#hybrid-rendering
export default defineNuxtConfig({
  devtools: { enabled: false },
  app: {
    head: {
      title: "Ristorante",
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1.0, user-scalable=no",
      htmlAttrs: { lang: "it" }
    },
  },
  routeRules: {
    // Homepage pre-rendered at build time
    "/": { prerender: true },
    // Admin dashboard renders only on client-side
    "/admin/**": { ssr: false },
    // Add cors headers on API routes
    "/api/**": { cors: true }
  },
  build: { transpile: ["@vuepic/vue-datepicker"] },
  imports: { dirs: ["stores"] },
  css: ["~/assets/css/main.sass"],
  modules: [
    "@nuxt/image",
    "@nuxtjs/supabase",
    "@pinia-plugin-persistedstate/nuxt",
    ["@pinia/nuxt", { autoImports: ["defineStore", "acceptHMRUpdate"] }],
    ["@nuxtjs/google-fonts", { families: { Poppins: [300, 400, 500, 600] }, download: true, overwriting: false, display: "swap" }],
    "nuxt-gtag",
    'nuxt3-meta-pixel'
  ],
  postcss: { plugins: { tailwindcss: {}, autoprefixer: {} } },
  supabase: { redirect: false },
  vite: {
    plugins: [svgLoader()],
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true
      }
    }
  },
  image: { format: ["webp"], domains: ["avatars0.githubusercontent.com"] },
  // events tracking Google Analytics, Facebook
  gtag: { id: "G-7WHW3K85WN" },
  facebook: {
    track: 'PageView',
    pixelId: '868772751506596',
    autoPageView: true,
    disabled: false,
    // debug: true
  },
});
