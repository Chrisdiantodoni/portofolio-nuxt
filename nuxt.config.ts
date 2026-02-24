// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxt/content",
    "@vueuse/nuxt",
    "nuxt-og-image",
    "motion-v/nuxt",
    "@pinia/nuxt",
    "@nuxtjs/cloudinary",
  ],
  cloudinary: {
    cloudName: "dinfxtjsv",
  },
  routeRules: {
    // Halaman utama diperbarui di latar belakang setiap jam (Hybrid)
    "/": process.env.NODE_ENV === "production" ? { isr: 3600 } : {},
    "/api/**": { cors: true },
  },

  devtools: {
    enabled: true,
  },
  runtimeConfig: {
    // runtimeConfig di tingkat root hanya bisa diakses di Server Side
    gmailUser: process.env.GMAIL_USER,
    gmailPassword: process.env.GMAIL_APP_PASSWORD,
    gmailName: process.env.GMAIL_SENDER_NAME,
  },

  css: ["~/assets/css/main.css"],

  compatibilityDate: "2024-11-01",

  nitro: {
    prerender: {
      routes: ["/"],
      crawlLinks: true,
    },
  },
  vite: {
    build: {
      minify: "esbuild", // Use esbuild instead of oxc
    },
  },
  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },
});
